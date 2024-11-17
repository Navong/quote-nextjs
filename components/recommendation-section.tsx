"use client"

// import { useTheme } from "next-themes"

export function RecommendationSection() {
  // const { theme } = useTheme()

  const recommendations = [
    {
      id: 1,
      title: "Daily Quote",
      description: "Start your day with inspiration",
      bgColorLight: "bg-white",
      bgColorDark: "dark:bg-gray-800",
    },
    {
      id: 2,
      title: "Weekly Challenge",
      description: "Push yourself to grow",
      bgColorLight: "bg-purple-50",
      bgColorDark: "dark:bg-purple-900",
    },
    {
      id: 3,
      title: "Monthly Reflection",
      description: "Review and set new goals",
      bgColorLight: "bg-green-50",
      bgColorDark: "dark:bg-green-900",
    },
  ]

  return (
    <div className="space-y-4">
      {recommendations.map((rec) => (
        <div
          key={rec.id}
          className={`${rec.bgColorLight} ${rec.bgColorDark} rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200`}
        >
          <h3 className="text-lg font-medium mb-2 text-foreground">{rec.title}</h3>
          <p className="text-muted-foreground">{rec.description}</p>
        </div>
      ))}
    </div>
  )
}

