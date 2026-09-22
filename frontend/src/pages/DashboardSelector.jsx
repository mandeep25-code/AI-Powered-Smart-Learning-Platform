import { useState } from "react";
import DashboardConcept1 from "./Dashboard_Concept1";
import DashboardConcept2 from "./Dashboard_Concept2";
import DashboardConcept3 from "./Dashboard_Concept3";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/common/ui";

const concepts = [
  {
    id: 1,
    name: "Glassmorphism Dark",
    description: "Premium dark theme with glassmorphism effects, animated backgrounds, and gradient accents",
    preview: "Purple/Pink gradients with blur effects"
  },
  {
    id: 2,
    name: "Clean Modern",
    description: "Minimalist design with clean lines, card-based layout, and professional aesthetics",
    preview: "Clean card-based interface with subtle accents"
  },
  {
    id: 3,
    name: "Futuristic Command",
    description: "Sci-fi inspired command center with monospace fonts, grid patterns, and cyber aesthetics",
    preview: "Dark theme with cyan accents and technical styling"
  }
];

export default function DashboardSelector() {
  const [selectedConcept, setSelectedConcept] = useState(1);

  const renderDashboard = () => {
    switch(selectedConcept) {
      case 1: return <DashboardConcept1 />;
      case 2: return <DashboardConcept2 />;
      case 3: return <DashboardConcept3 />;
      default: return <DashboardConcept1 />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Selection Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard Design Selection</h1>
              <p className="text-muted-foreground text-sm">Choose your preferred dashboard design</p>
            </div>
            <Button
              onClick={() => {
                // This would normally update the actual Dashboard.jsx file
                alert(`Selected Concept ${selectedConcept}. Replace Dashboard.jsx with Dashboard_Concept${selectedConcept}.jsx to apply.`);
              }}
              className="bg-primary text-primary-foreground"
            >
              <Icon name="check" className="h-4 w-4 mr-2" />
              Apply Selection
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {concepts.map((concept) => (
              <button
                key={concept.id}
                onClick={() => setSelectedConcept(concept.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  selectedConcept === concept.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 bg-card"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    selectedConcept === concept.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    {concept.id}
                  </div>
                  <h3 className="font-semibold text-foreground">{concept.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{concept.description}</p>
                <div className="text-xs text-muted-foreground">{concept.preview}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dashboard Preview */}
      <div className="pt-40">
        {renderDashboard()}
      </div>
    </div>
  );
}