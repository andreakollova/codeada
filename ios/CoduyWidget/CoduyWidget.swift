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
        GlossaryTimelineEntry(date: Date(), term: "API", definition: "Application Programming Interface", detail: "A set of rules that lets apps talk to each other.", isPro: true, streak: 3)
    }

    func getSnapshot(in context: Context, completion: @escaping (GlossaryTimelineEntry) -> ()) {
        let streak = UserDefaults(suiteName: "group.sk.coduy.app")?.integer(forKey: "coduy-streak") ?? 0
        completion(GlossaryTimelineEntry(date: Date(), term: "API", definition: "Application Programming Interface", detail: "A set of rules that lets apps talk to each other.", isPro: true, streak: streak))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<GlossaryTimelineEntry>) -> ()) {
        // Always fetch free term (monthly). Pro users get daily via ?pro=true
        let shared0 = UserDefaults(suiteName: "group.sk.coduy.app")
        let isPro = shared0?.bool(forKey: "coduy-pro") ?? false
        let urlStr = isPro ? "https://www.coduy.com/api/widget?pro=true" : "https://www.coduy.com/api/widget"
        guard let url = URL(string: urlStr) else {
            let entry = GlossaryTimelineEntry(date: Date(), term: "Coduy", definition: "", detail: "Learn to code", isPro: true)
            completion(Timeline(entries: [entry], policy: .after(Date().addingTimeInterval(3600))))
            return
        }

        URLSession.shared.dataTask(with: url) { data, _, _ in
            var entry: GlossaryTimelineEntry

            let shared = UserDefaults(suiteName: "group.sk.coduy.app")
            let streak = shared?.integer(forKey: "coduy-streak") ?? 0

            if let data = data, let glossary = try? JSONDecoder().decode(GlossaryEntry.self, from: data) {
                let lang = shared?.string(forKey: "coduy-locale") ?? Locale.current.language.languageCode?.identifier ?? "en"
                let detail = lang == "sk" ? glossary.sk : glossary.en
                entry = GlossaryTimelineEntry(date: Date(), term: glossary.term, definition: glossary.full, detail: detail, isPro: true, streak: streak)
            } else {
                let lang = shared?.string(forKey: "coduy-locale") ?? Locale.current.language.languageCode?.identifier ?? "en"
                let detail = lang == "sk" ? "Postupné inštrukcie na vyriešenie problému." : "Step-by-step instructions to solve a problem."
                entry = GlossaryTimelineEntry(date: Date(), term: "Algorithm", definition: "", detail: detail, isPro: false, streak: streak)
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
    let streak: Int
}

struct ByteView: View {
    let size: CGFloat
    let variant: Int // 0-3 for different looks

    // Variant colors
    var accentColor: Color {
        switch variant % 4 {
        case 0: return Color(red: 0.29, green: 0.87, blue: 0.5)  // green (builder)
        case 1: return Color(red: 0.66, green: 0.33, blue: 0.97) // purple (ai pilot)
        case 2: return Color(red: 0.38, green: 0.65, blue: 0.98) // blue (mechanic)
        case 3: return Color(red: 0.96, green: 0.62, blue: 0.04) // golden (master)
        default: return .white
        }
    }

    var body: some View {
        ZStack {
            // Head
            Circle()
                .fill(Color(red: 0.06, green: 0.06, blue: 0.06))
                .frame(width: size, height: size)
            Circle()
                .stroke(Color.white, lineWidth: size * 0.06)
                .frame(width: size, height: size)
            // Eyes
            Ellipse()
                .fill(Color.white)
                .frame(width: size * 0.15, height: size * 0.18)
                .offset(x: -size * 0.15, y: -size * 0.02)
            Ellipse()
                .fill(Color.white)
                .frame(width: size * 0.15, height: size * 0.18)
                .offset(x: size * 0.15, y: -size * 0.02)
            // Smile
            Path { path in
                path.addArc(
                    center: CGPoint(x: size / 2, y: size * 0.52),
                    radius: size * 0.2,
                    startAngle: .degrees(15),
                    endAngle: .degrees(165),
                    clockwise: true
                )
            }
            .stroke(Color.white.opacity(0.6), style: StrokeStyle(lineWidth: size * 0.05, lineCap: .round))
            .frame(width: size, height: size)
            // Antenna dot - colored by variant
            Circle()
                .fill(accentColor)
                .frame(width: size * 0.12, height: size * 0.12)
                .offset(y: -size * 0.58)
            Rectangle()
                .fill(Color.white.opacity(0.5))
                .frame(width: size * 0.04, height: size * 0.14)
                .offset(y: -size * 0.48)
            // Variant accessories
            if variant == 1 {
                // AI Pilot - small lightning bolt
                Text("⚡").font(.system(size: size * 0.2)).offset(x: size * 0.35, y: -size * 0.35)
            } else if variant == 3 {
                // Master - small star
                Text("★").font(.system(size: size * 0.18)).foregroundColor(accentColor).offset(x: size * 0.35, y: -size * 0.35)
            }
        }
    }
}

struct CoduyWidgetEntryView: View {
    var entry: Provider.Entry
    @Environment(\.widgetFamily) var family

    var isSk: Bool {
        Locale.current.language.languageCode?.identifier == "sk"
    }

    var streakColor: Color {
        if entry.streak >= 7 { return Color(red: 1.0, green: 0.4, blue: 0.1) } // hot orange
        if entry.streak >= 3 { return Color(red: 1.0, green: 0.6, blue: 0.2) } // warm amber
        return Color(red: 0.29, green: 0.87, blue: 0.5) // green
    }

    var body: some View {
        VStack(alignment: .leading, spacing: family == .systemSmall ? 4 : 6) {
                // Header - logo + streak + byte
                HStack(alignment: .center) {
                    Image("CoduyLogo")
                        .resizable()
                        .renderingMode(.template)
                        .foregroundColor(.white)
                        .aspectRatio(contentMode: .fit)
                        .frame(height: 14)

                    Spacer()

                    // Streak badge
                    if entry.streak > 0 {
                        HStack(spacing: 3) {
                            Text("🔥")
                                .font(.system(size: family == .systemSmall ? 12 : 14))
                            Text("\(entry.streak)")
                                .font(.system(size: family == .systemSmall ? 12 : 14, weight: .bold, design: .rounded))
                                .foregroundColor(streakColor)
                        }
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(streakColor.opacity(0.15))
                        .cornerRadius(8)
                    }

                    // Rotate Byte variants daily
                    Image(["ByteBuilder", "ByteAi", "ByteMechanic", "ByteMaster"][Calendar.current.component(.day, from: Date()) % 4])
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: family == .systemSmall ? 38 : 44, height: family == .systemSmall ? 38 : 44)
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
                    .font(.system(size: family == .systemSmall ? 11 : 13))
                    .foregroundColor(.white.opacity(0.7))
                    .lineLimit(family == .systemSmall ? 3 : 4)

                // Footer
                HStack {
                    Text(isSk ? "Slovo dňa" : "Word of the Day")
                        .font(.system(size: 8, weight: .semibold))
                        .foregroundColor(.white.opacity(0.25))
                        .textCase(.uppercase)
                        .tracking(1)

                    if entry.streak > 0 {
                        Spacer()
                        Text(isSk ? "\(entry.streak) dní streak" : "\(entry.streak) day streak")
                            .font(.system(size: 8, weight: .semibold))
                            .foregroundColor(streakColor.opacity(0.6))
                            .textCase(.uppercase)
                            .tracking(0.5)
                    }
                }
            }
            .padding(family == .systemSmall ? 14 : 16)
    }
}

@main
struct CoduyWidget: Widget {
    let kind: String = "CoduyWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            CoduyWidgetEntryView(entry: entry)
                .containerBackground(Color(red: 0.11, green: 0.11, blue: 0.12), for: .widget)
        }
        .configurationDisplayName("Word of the Day")
        .description("Learn a new programming term every day.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}
