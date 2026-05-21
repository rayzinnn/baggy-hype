import { redirect } from "next/navigation";

export default function AdminTemplateHome() {
  redirect("/admin/dashboard");
}
