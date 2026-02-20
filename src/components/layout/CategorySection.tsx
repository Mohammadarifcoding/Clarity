import { Meeting } from "@/src/types/meeting";
import MeetingItem from "./MeetingItem";

const CategorySection = ({
  title,
  meetings,
}: {
  title: string;
  meetings: Meeting[];
}) => {
  if (!meetings.length) return null;

  return (
    <section className="mb-6">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 mb-2">
        {title}
      </h3>
      <div className="space-y-1">
        {meetings.map((meeting) => (
          <MeetingItem key={meeting.id} meeting={meeting} />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
