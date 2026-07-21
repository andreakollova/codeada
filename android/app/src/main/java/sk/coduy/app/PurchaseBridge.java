package sk.coduy.app;

import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import com.android.billingclient.api.*;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

/**
 * Bridges web JavaScript to Google Play Billing via WebView JavascriptInterface.
 * Web calls: window.coduyPurchase.purchase("coduy_pro_monthly")
 * Response: window.__coduyPurchaseCallback({success: true, ...})
 */
public class PurchaseBridge implements PurchasesUpdatedListener {
    private static final String TAG = "CoduyPurchase";
    private BillingClient billingClient;
    private WebView webView;
    private MainActivity activity;

    public PurchaseBridge(MainActivity activity, WebView webView) {
        this.activity = activity;
        this.webView = webView;

        billingClient = BillingClient.newBuilder(activity)
                .setListener(this)
                .enablePendingPurchases()
                .build();

        billingClient.startConnection(new BillingClientStateListener() {
            @Override
            public void onBillingSetupFinished(BillingResult result) {
                if (result.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                    Log.d(TAG, "Billing client connected");
                }
            }

            @Override
            public void onBillingServiceDisconnected() {
                Log.d(TAG, "Billing client disconnected");
            }
        });
    }

    @JavascriptInterface
    public void purchase(String productId) {
        Log.d(TAG, "Purchase requested: " + productId);

        List<QueryProductDetailsParams.Product> productList = new ArrayList<>();
        productList.add(QueryProductDetailsParams.Product.newBuilder()
                .setProductId(productId)
                .setProductType(BillingClient.ProductType.SUBS)
                .build());

        QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
                .setProductList(productList)
                .build();

        billingClient.queryProductDetailsAsync(params, (billingResult, productDetailsList) -> {
            if (billingResult.getResponseCode() != BillingClient.BillingResponseCode.OK || productDetailsList.isEmpty()) {
                sendResult("{\"success\":false,\"error\":\"Product not found\"}");
                return;
            }

            ProductDetails productDetails = productDetailsList.get(0);
            List<ProductDetails.SubscriptionOfferDetails> offers = productDetails.getSubscriptionOfferDetails();
            if (offers == null || offers.isEmpty()) {
                sendResult("{\"success\":false,\"error\":\"No offers available\"}");
                return;
            }

            BillingFlowParams.ProductDetailsParams detailsParams = BillingFlowParams.ProductDetailsParams.newBuilder()
                    .setProductDetails(productDetails)
                    .setOfferToken(offers.get(0).getOfferToken())
                    .build();

            List<BillingFlowParams.ProductDetailsParams> paramsList = new ArrayList<>();
            paramsList.add(detailsParams);

            BillingFlowParams flowParams = BillingFlowParams.newBuilder()
                    .setProductDetailsParamsList(paramsList)
                    .build();

            activity.runOnUiThread(() -> {
                billingClient.launchBillingFlow(activity, flowParams);
            });
        });
    }

    @JavascriptInterface
    public void restore() {
        billingClient.queryPurchasesAsync(
                QueryPurchasesParams.newBuilder().setProductType(BillingClient.ProductType.SUBS).build(),
                (billingResult, purchasesList) -> {
                    boolean hasActive = false;
                    for (Purchase p : purchasesList) {
                        if (p.getPurchaseState() == Purchase.PurchaseState.PURCHASED) {
                            hasActive = true;
                            break;
                        }
                    }
                    sendResult("{\"success\":true,\"isActive\":" + hasActive + "}");
                }
        );
    }

    @Override
    public void onPurchasesUpdated(BillingResult billingResult, List<Purchase> purchases) {
        if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK && purchases != null) {
            for (Purchase purchase : purchases) {
                // Acknowledge the purchase
                if (!purchase.isAcknowledged()) {
                    AcknowledgePurchaseParams ackParams = AcknowledgePurchaseParams.newBuilder()
                            .setPurchaseToken(purchase.getPurchaseToken())
                            .build();
                    billingClient.acknowledgePurchase(ackParams, result -> {
                        Log.d(TAG, "Purchase acknowledged: " + result.getResponseCode());
                    });
                }

                try {
                    JSONObject json = new JSONObject();
                    json.put("success", true);
                    json.put("productId", purchase.getProducts().get(0));
                    json.put("purchaseToken", purchase.getPurchaseToken());
                    sendResult(json.toString());
                } catch (Exception e) {
                    sendResult("{\"success\":true}");
                }
            }
        } else if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.USER_CANCELED) {
            sendResult("{\"success\":false,\"error\":\"cancelled\"}");
        } else {
            sendResult("{\"success\":false,\"error\":\"" + billingResult.getDebugMessage() + "\"}");
        }
    }

    private void sendResult(String json) {
        activity.runOnUiThread(() -> {
            webView.evaluateJavascript("window.__coduyPurchaseCallback && window.__coduyPurchaseCallback(" + json + ")", null);
        });
    }
}
