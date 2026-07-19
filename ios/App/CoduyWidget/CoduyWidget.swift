import WidgetKit
import SwiftUI

struct GlossaryEntry: Codable {
    let term: String
    let full: String
    let en: String
    let sk: String
}

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> GlossaryTimelineEntry {
        GlossaryTimelineEntry(date: Date(), term: "API", definition: "Application Programming Interface", detail: "A set of rules that lets apps talk to each other.", isPro: true)
    }

    func getSnapshot(in context: Context, completion: @escaping (GlossaryTimelineEntry) -> ()) {
        completion(GlossaryTimelineEntry(date: Date(), term: "API", definition: "Application Programming Interface", detail: "A set of rules that lets apps talk to each other.", isPro: true))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<GlossaryTimelineEntry>) -> ()) {
        // Pro users get daily terms, free users get monthly
        // TODO: check Pro status via shared UserDefaults/App Group
        let isPro = true // For now treat all widget users as Pro
        let urlStr = isPro ? "https://www.coduy.sk/api/widget?pro=true" : "https://www.coduy.sk/api/widget"
        guard let url = URL(string: urlStr) else {
            let entry = GlossaryTimelineEntry(date: Date(), term: "Coduy", definition: "", detail: "Learn to code", isPro: true)
            completion(Timeline(entries: [entry], policy: .after(Date().addingTimeInterval(3600))))
            return
        }

        URLSession.shared.dataTask(with: url) { data, _, _ in
            var entry: GlossaryTimelineEntry

            if let data = data, let glossary = try? JSONDecoder().decode(GlossaryEntry.self, from: data) {
                let lang = Locale.current.language.languageCode?.identifier ?? "en"
                let detail = lang == "sk" ? glossary.sk : glossary.en
                entry = GlossaryTimelineEntry(date: Date(), term: glossary.term, definition: glossary.full, detail: detail, isPro: true)
            } else {
                let lang = Locale.current.language.languageCode?.identifier ?? "en"
                let msg = lang == "sk" ? "0 EUR - 7 dní zadarmo. Získaj Pro pre denné slovíčka." : "0 EUR - 7 days free. Get Pro for daily terms."
                entry = GlossaryTimelineEntry(date: Date(), term: "Coduy Pro", definition: lang == "sk" ? "Získaj widget" : "Get widget", detail: msg, isPro: false)
            }

            completion(Timeline(entries: [entry], policy: .after(Date().addingTimeInterval(6 * 3600))))
        }.resume()
    }
}

struct GlossaryTimelineEntry: TimelineEntry {
    let date: Date
    let term: String
    let definition: String
    let detail: String
    let isPro: Bool
}

struct ByteView: View {
    let size: CGFloat

    var body: some View {
        ZStack {
            // Head
            Circle()
                .stroke(Color.white, lineWidth: 1.5)
                .frame(width: size, height: size)
            // Left eye
            Ellipse()
                .fill(Color.white)
                .frame(width: size * 0.12, height: size * 0.15)
                .offset(x: -size * 0.14, y: -size * 0.03)
            // Right eye
            Ellipse()
                .fill(Color.white)
                .frame(width: size * 0.12, height: size * 0.15)
                .offset(x: size * 0.14, y: -size * 0.03)
            // Smile
            Path { path in
                path.addArc(center: CGPoint(x: size/2, y: size * 0.55), radius: size * 0.18, startAngle: .degrees(10), endAngle: .degrees(170), clockwise: true)
            }
            .stroke(Color.white.opacity(0.5), lineWidth: 1.5)
            .frame(width: size, height: size)
            .offset(y: size * 0.05)
            // Antenna
            Circle()
                .fill(Color.white)
                .frame(width: size * 0.08, height: size * 0.08)
                .offset(y: -size * 0.55)
            Rectangle()
                .fill(Color.white.opacity(0.5))
                .frame(width: 1.5, height: size * 0.12)
                .offset(y: -size * 0.47)
        }
    }
}

struct CoduyWidgetEntryView: View {
    var entry: Provider.Entry
    @Environment(\.widgetFamily) var family

    var isSk: Bool {
        Locale.current.language.languageCode?.identifier == "sk"
    }

    var body: some View {
        ZStack {
            // Background
            LinearGradient(
                colors: [Color(red: 0.04, green: 0.04, blue: 0.04), Color(red: 0.08, green: 0.08, blue: 0.08)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )

            VStack(alignment: .leading, spacing: family == .systemSmall ? 4 : 6) {
                // Header
                HStack(alignment: .center) {
                    Image("CoduyLogo")
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(height: 14)
                        .opacity(0.5)

                    Spacer()

                    ByteView(size: family == .systemSmall ? 22 : 26)
                }

                Spacer()

                // Term
                Text(entry.term)
                    .font(.system(size: family == .systemSmall ? 24 : 30, weight: .heavy, design: .rounded))
                    .foregroundColor(.white)
                    .lineLimit(1)

                // Full name
                if !entry.definition.isEmpty {
                    Text(entry.definition)
                        .font(.system(size: family == .systemSmall ? 10 : 12, weight: .semibold))
                        .foregroundColor(Color(red: 0.29, green: 0.87, blue: 0.5))
                        .lineLimit(1)
                }

                // Description
                Text(entry.detail)
                    .font(.system(size: family == .systemSmall ? 10 : 12))
                    .foregroundColor(.white.opacity(0.5))
                    .lineLimit(family == .systemSmall ? 2 : 3)

                // Footer
                Text(isSk ? "Slovo dna" : "Word of the Day")
                    .font(.system(size: 8, weight: .semibold))
                    .foregroundColor(.white.opacity(0.2))
                    .textCase(.uppercase)
                    .tracking(1)
            }
            .padding(family == .systemSmall ? 14 : 16)
        }
    }
}

@main
struct CoduyWidget: Widget {
    let kind: String = "CoduyWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            CoduyWidgetEntryView(entry: entry)
                .containerBackground(.black, for: .widget)
        }
        .configurationDisplayName("Word of the Day")
        .description("Learn a new programming term every day.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}
