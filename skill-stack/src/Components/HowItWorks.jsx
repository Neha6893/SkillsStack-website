import { BookOpen, Search, LogIn, UploadCloud, Coins } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <BookOpen size={36} className="text-blue-600" />,
      title: "1. Visit SkillStack",
      description:
        "Start by visiting our website. login with mail without need of remembering password and explore our vast collection of notes.",
    },
    {
      icon: <Search size={36} className="text-green-600" />,
      title: "2. Browse Notes",
      description:
        "Search and filter notes by title or subject to quickly find what you need.",
    },
    {
      icon: <LogIn size={36} className="text-purple-600" />,
      title: "3. Login to Download",
      description:
        "Login to your account to download notes. This helps us track points and reward contributors.",
    },
    {
      icon: <UploadCloud size={36} className="text-orange-600" />,
      title: "4. Earn Points by Uploading",
      description:
        "If you don’t have enough points, upload your own notes. Please Avoid duplicates to earn points instantly!",
    },
    {
      icon: <Coins size={36} className="text-yellow-600" />,
      title: "5. Get Notes or Pay",
      description:
        "Use your earned points to download notes, or choose to pay if you don't have enough points.",
    },
  ];

  return (
    <section className="bg-gray-50 py-16 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-10">
          How SkillStack Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center hover:shadow-lg transition"
            >
              <div className="bg-gray-100 rounded-full p-4 mb-4">
                {step.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}