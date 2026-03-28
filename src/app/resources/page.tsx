import { redirect } from "next/navigation";
import { studyGuides } from "@/data/study-guides";

export default function ResourcesIndex() {
  redirect(`/resources/${studyGuides[0].slug}`);
}
