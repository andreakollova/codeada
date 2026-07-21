package sk.coduy.app;

import android.os.Bundle;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Register Google Play Billing bridge after WebView is ready
        getBridge().getWebView().post(() -> {
            WebView webView = getBridge().getWebView();
            webView.addJavascriptInterface(new PurchaseBridge(this, webView), "coduyPurchase");
        });
    }
}
