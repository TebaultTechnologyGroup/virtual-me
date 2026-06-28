import { Button } from "@/components/ui/button";
import { supabase, test } from "@/lib/supabase-client";

const TestPage: React.FC = () => {
  const handleClick = async () => {
    try {
      test();
    } catch (error) {
      console.error("Load failed:", error);
    } finally {
    }
  };

  return (
    <div>
      <Button onClick={handleClick}>Click me</Button>
    </div>
  );
};

export default TestPage;
