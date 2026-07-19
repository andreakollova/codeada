import Foundation
import Capacitor
import StoreKit

@objc(CoduyStorePlugin)
public class CoduyStorePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "CoduyStorePlugin"
    public let jsName = "CoduyStore"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "getProducts", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "purchase", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "restorePurchases", returnType: CAPPluginReturnPromise),
    ]

    private let productIds = ["coduy_pro_monthly", "coduy_pro_yearly"]

    @objc func getProducts(_ call: CAPPluginCall) {
        Task {
            do {
                let products = try await Product.products(for: productIds)
                let result = products.map { product in
                    return [
                        "id": product.id,
                        "displayName": product.displayName,
                        "displayPrice": product.displayPrice,
                        "price": "\(product.price)",
                        "type": product.type == .autoRenewable ? "subscription" : "other"
                    ]
                }
                call.resolve(["products": result])
            } catch {
                call.reject("Failed to load products: \(error.localizedDescription)")
            }
        }
    }

    @objc func purchase(_ call: CAPPluginCall) {
        guard let productId = call.getString("productId") else {
            call.reject("Missing productId")
            return
        }

        Task {
            do {
                let products = try await Product.products(for: [productId])
                guard let product = products.first else {
                    call.reject("Product not found")
                    return
                }

                let result = try await product.purchase()

                switch result {
                case .success(let verification):
                    switch verification {
                    case .verified(let transaction):
                        // Finish the transaction
                        await transaction.finish()

                        // Get receipt for server verification
                        let receiptData = try? JSONEncoder().encode([
                            "transactionId": "\(transaction.id)",
                            "productId": transaction.productID,
                            "originalId": "\(transaction.originalID)",
                            "purchaseDate": "\(transaction.purchaseDate.timeIntervalSince1970)",
                            "environment": "\(transaction.environment.rawValue)"
                        ])
                        let receipt = receiptData.flatMap { String(data: $0, encoding: .utf8) } ?? ""

                        call.resolve([
                            "success": true,
                            "transactionId": "\(transaction.id)",
                            "productId": transaction.productID,
                            "receipt": receipt
                        ])

                    case .unverified(_, let error):
                        call.reject("Transaction unverified: \(error.localizedDescription)")
                    }

                case .userCancelled:
                    call.resolve(["success": false, "error": "cancelled"])

                case .pending:
                    call.resolve(["success": false, "error": "pending"])

                @unknown default:
                    call.reject("Unknown purchase result")
                }
            } catch {
                call.reject("Purchase failed: \(error.localizedDescription)")
            }
        }
    }

    @objc func restorePurchases(_ call: CAPPluginCall) {
        Task {
            do {
                try await AppStore.sync()

                var active: [[String: String]] = []
                for await result in Transaction.currentEntitlements {
                    if case .verified(let transaction) = result {
                        active.append([
                            "productId": transaction.productID,
                            "transactionId": "\(transaction.id)"
                        ])
                    }
                }

                call.resolve(["purchases": active])
            } catch {
                call.reject("Restore failed: \(error.localizedDescription)")
            }
        }
    }
}
