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
        GlossaryTimelineEntry(date: Date(), term: "API", definition: "Application Programming Interface", detail: "A set of rules that lets apps talk to each other.")
    }

    func getSnapshot(in context: Context, completion: @escaping (GlossaryTimelineEntry) -> ()) {
        let entry = GlossaryTimelineEntry(date: Date(), term: "API", definition: "Application Programming Interface", detail: "A set of rules that lets apps talk to each other.")
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<GlossaryTimelineEntry>) -> ()) {
        guard let url = URL(string: "https://www.coduy.sk/api/widget") else {
            let entry = GlossaryTimelineEntry(date: Date(), term: "Coduy", definition: "", detail: "Learn to code")
            let timeline = Timeline(entries: [entry], policy: .after(Date().addingTimeInterval(3600)))
            completion(timeline)
            return
        }

        URLSession.shared.dataTask(with: url) { data, _, _ in
            var entry: GlossaryTimelineEntry

            if let data = data, let glossary = try? JSONDecoder().decode(GlossaryEntry.self, from: data) {
                let lang = Locale.current.language.languageCode?.identifier ?? "en"
                let detail = lang == "sk" ? glossary.sk : glossary.en
                entry = GlossaryTimelineEntry(date: Date(), term: glossary.term, definition: glossary.full, detail: detail)
            } else {
                entry = GlossaryTimelineEntry(date: Date(), term: "Coduy", definition: "", detail: "Learn to code")
            }

            // Refresh every 6 hours
            let nextUpdate = Date().addingTimeInterval(6 * 3600)
            let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
            completion(timeline)
        }.resume()
    }
}

struct GlossaryTimelineEntry: TimelineEntry {
    let date: Date
    let term: String
    let definition: String
    let detail: String
}

struct CoduyWidgetEntryView: View {
    var entry: Provider.Entry

    @Environment(\.widgetFamily) var family

    var body: some View {
        ZStack {
            Color.black
            VStack(alignment: .leading, spacing: 6) {
                HStack {
                    Text("coduy")
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(.white.opacity(0.5))
                    Spacer()
                    Text("📚")
                        .font(.system(size: 10))
                }

                Text(entry.term)
                    .font(.system(size: family == .systemSmall ? 22 : 28, weight: .heavy))
                    .foregroundColor(.white)

                if !entry.definition.isEmpty {
                    Text(entry.definition)
                        .font(.system(size: 11, weight: .semibold))
                        .foregroundColor(Color(red: 0.29, green: 0.87, blue: 0.5))
                        .lineLimit(1)
                }

                Text(entry.detail)
                    .font(.system(size: family == .systemSmall ? 11 : 13))
                    .foregroundColor(.white.opacity(0.6))
                    .lineLimit(family == .systemSmall ? 2 : 3)
            }
            .padding(14)
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
