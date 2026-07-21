import Foundation
import WebKit
import StoreKit
import Capacitor

/// Bridges web JavaScript to native StoreKit 2 purchases via WKScriptMessageHandler.
/// Web calls: window.webkit.messageHandlers.coduyPurchase.postMessage({action: "purchase", productId: "..."})
/// Response injected via evaluateJavaScript into window.__coduyPurchaseResult
class PurchaseBridge: NSObject, WKScriptMessageHandler {

    static let shared = PurchaseBridge()
    private let productIds = ["coduy_pro_monthly", "coduy_pro_yearly"]

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard let body = message.body as? [String: Any],
              let action = body["action"] as? String else { return }

        let webView = message.webView

        switch action {
        case "purchase":
            guard let productId = body["productId"] as? String else {
                sendResult(webView: webView, result: ["success": false, "error": "Missing productId"])
                return
            }
            Task { await handlePurchase(productId: productId, webView: webView) }

        case "restore":
            Task { await handleRestore(webView: webView) }

        case "checkStatus":
            Task { await handleCheckStatus(webView: webView) }

        default:
            sendResult(webView: webView, result: ["success": false, "error": "Unknown action"])
        }
    }

    private func handlePurchase(productId: String, webView: WKWebView?) async {
        do {
            let products = try await Product.products(for: [productId])
            guard let product = products.first else {
                sendResult(webView: webView, result: ["success": false, "error": "Product not found"])
                return
            }

            let result = try await product.purchase()

            switch result {
            case .success(let verification):
                switch verification {
                case .verified(let transaction):
                    await transaction.finish()
                    sendResult(webView: webView, result: [
                        "success": true,
                        "transactionId": "\(transaction.id)",
                        "productId": transaction.productID
                    ])
                case .unverified(_, let error):
                    sendResult(webView: webView, result: ["success": false, "error": "Unverified: \(error.localizedDescription)"])
                }
            case .userCancelled:
                sendResult(webView: webView, result: ["success": false, "error": "cancelled"])
            case .pending:
                sendResult(webView: webView, result: ["success": false, "error": "pending"])
            @unknown default:
                sendResult(webView: webView, result: ["success": false, "error": "unknown"])
            }
        } catch {
            sendResult(webView: webView, result: ["success": false, "error": error.localizedDescription])
        }
    }

    private func handleRestore(webView: WKWebView?) async {
        do {
            try await AppStore.sync()
            var active: [[String: String]] = []
            for await result in Transaction.currentEntitlements {
                if case .verified(let transaction) = result {
                    active.append(["productId": transaction.productID])
                }
            }
            sendResult(webView: webView, result: ["success": true, "purchases": active])
        } catch {
            sendResult(webView: webView, result: ["success": false, "error": error.localizedDescription])
        }
    }

    private func handleCheckStatus(webView: WKWebView?) async {
        var hasActive = false
        for await result in Transaction.currentEntitlements {
            if case .verified(_) = result {
                hasActive = true
                break
            }
        }
        sendResult(webView: webView, result: ["success": true, "isActive": hasActive])
    }

    private func sendResult(webView: WKWebView?, result: [String: Any]) {
        guard let webView = webView else { return }
        if let data = try? JSONSerialization.data(withJSONObject: result),
           let json = String(data: data, encoding: .utf8) {
            DispatchQueue.main.async {
                webView.evaluateJavaScript("window.__coduyPurchaseCallback && window.__coduyPurchaseCallback(\(json))")
            }
        }
    }

    /// Register the message handler on a WKWebView
    static func register(on webView: WKWebView) {
        webView.configuration.userContentController.add(shared, name: "coduyPurchase")
    }
}
