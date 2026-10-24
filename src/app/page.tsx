import { StoryRoot } from "@/components/story/StoryRoot";
import { SceneQuestion } from "@/components/scenes/SceneQuestion";
import { SceneProblem } from "@/components/scenes/SceneProblem";
import { SceneIdea } from "@/components/scenes/SceneIdea";
import { SceneProduct } from "@/components/scenes/SceneProduct";
import { SceneKnowMoney } from "@/components/scenes/SceneKnowMoney";
import { SceneSmarterTracking } from "@/components/scenes/SceneSmarterTracking";
import { SceneInsights } from "@/components/scenes/SceneInsights";
import { SceneHabits } from "@/components/scenes/SceneHabits";
import { SceneBehind } from "@/components/scenes/SceneBehind";
import { SceneFinal } from "@/components/scenes/SceneFinal";

export default function Home() {
  return (
    <StoryRoot>
      <SceneQuestion />
      <SceneProblem />
      <SceneIdea />
      <SceneProduct />
      <SceneKnowMoney />
      <SceneSmarterTracking />
      <SceneInsights />
      <SceneHabits />
      <SceneBehind />
      <SceneFinal />
    </StoryRoot>
  );
}
