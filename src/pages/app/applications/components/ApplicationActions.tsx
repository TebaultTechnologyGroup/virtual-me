import type { ApplicationRecord } from "../types";
import { useState } from "react";

interface Props {
  application: ApplicationRecord;
  onApplicationUpdated: (application: ApplicationRecord) => void;
}

function ApplicationActions({ application, onApplicationUpdated }: Props) {
  const [saving, setSaving] = useState(false);

  return <div>coming soon {application.id}</div>;
}
export default ApplicationActions;
