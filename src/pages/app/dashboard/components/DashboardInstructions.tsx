import { useNavigate } from "react-router";
import { Check, FileText, Search, User } from "lucide-react";

export default function DashboardInstructions({
  profileComplete,
  rolesComplete,
}: {
  profileComplete: boolean;
  rolesComplete: boolean;
}) {
  const navigate = useNavigate();

  return (
    <div className="mt-6 max-w-7xl mx-auto flex flex-col">
      <div className="flex flex-col justify-center">
        <h2 className="text-5xl font-bold leading-tight">
          Welcome to Virtual Me!
        </h2>
        <p className="mt-4 mb-4 text-lg text-gray-600">
          Setup and train your AI twin and take advantage of:
        </p>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col justify-center">
          <div className="mt-1 grid md:grid-cols-3 gap-10">
            <Feature
              icon={<User className="w-8 h-8 text-blue-600" />}
              title="Virtual Interviews"
              desc="Let recruiters screen your AI twin — anytime, anywhere."
            />
            <Feature
              icon={<FileText className="w-8 h-8 text-blue-600" />}
              title="Resume Assistant"
              desc="Upload a job description and generate tailored resumes instantly."
            />
            <Feature
              icon={<Search className="w-8 h-8 text-blue-600" />}
              title="Interview Prep"
              desc="Practice common questions and get AI‑powered feedback."
            />
          </div>
        </div>
      </div>
      <h3 className="text-3xl pt-6 font-bold leading-tight">
        Setup and Role Alignment
      </h3>
      <p className="mt-4 text-gray-600">
        Before you can train your agent, you must complete two important steps:
      </p>

      <div className="flex flex-col gap-3 mb-6">
        <CustomButton
          title="Complete Setup"
          description="Enter your contact information, job history, education, skills, certifications, etc."
          icon={<FileText />}
          isDone={profileComplete}
          onClick={() => navigate("/app/setup")}
        />

        <CustomButton
          title="Complete Target Roles"
          description="Create one or more target roles.  This is used to train the Agent and taylor resumes."
          icon={<FileText />}
          isDone={rolesComplete}
          onClick={() => navigate("/app/role")}
        />
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div>{icon}</div>
      <h4 className="mt-4 text-xl font-semibold">{title}</h4>
      <p className="mt-2 text-gray-600">{desc}</p>
    </div>
  );
}

function CustomButton({
  title,
  description,
  icon,
  isDone,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  isDone: boolean;
  onClick: () => void;
}) {
  const border = isDone ? "border-green-600/40" : "border-blue-500";

  return (
    <button
      onClick={onClick}
      className={
        "border-2 " +
        border +
        " bg-card cursor-pointer w-full text-left flex items-center gap-4 rounded-xl px-5 py-4 transition-all"
      }
    >
      <div className="w-9 h-9 rounded-full flex items-center justify-center shrink">
        {isDone ? (
          <div className=" bg-green-100 text-green-700">
            <Check className="w-4 h-4 text-blue-500" />
          </div>
        ) : (
          <div className=" bg-blue-50 text-blue-500">{icon}</div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className={"text-sm font-medium"}>{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <div className="shrink-0">
        {isDone ? (
          <span className="text-xs font-medium bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full">
            Complete
          </span>
        ) : (
          <span className="text-xs font-medium bg-blue-50 text-blue-500 px-2.5 py-0.5 rounded-full">
            Incomplete
          </span>
        )}
      </div>
    </button>
  );
}
