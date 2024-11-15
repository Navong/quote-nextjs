export function RecommendationSection() {
  const recommendations = [
    {
      id: 1,
      title: "Daily Quote",
      description: "Start your day with inspiration",
      bgColor: "bg-white",
    },
    {
      id: 2,
      title: "Weekly Challenge",
      description: "Push yourself to grow",
      bgColor: "bg-purple-50",
    },
    {
      id: 3,
      title: "Monthly Reflection",
      description: "Review and set new goals",
      bgColor: "bg-green-50",
    },
  ]

  return (
    <div className="space-y-4">
      {recommendations.map((rec) => (
        <div
          key={rec.id}
          className={`${rec.bgColor} rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200`}
        >
          <h3 className="text-lg font-medium mb-2">{rec.title}</h3>
          <p className="text-gray-600">{rec.description}</p>
        </div>
      ))}
    </div>
  )
}

