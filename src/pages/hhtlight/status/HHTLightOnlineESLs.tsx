import { ArrowLeft, Wifi, Clock, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

const onlineESLs = [
  { id: "ESL-001", product: "Organic Bananas", lastSync: "2 min ago", aisle: "A1" },
  { id: "ESL-002", product: "Whole Milk 1L", lastSync: "1 min ago", aisle: "B3" },
  { id: "ESL-003", product: "Fresh Bread", lastSync: "3 min ago", aisle: "C2" },
  { id: "ESL-004", product: "Orange Juice", lastSync: "1 min ago", aisle: "B4" },
  { id: "ESL-005", product: "Greek Yogurt", lastSync: "2 min ago", aisle: "B2" },
  { id: "ESL-006", product: "Chicken Breast", lastSync: "4 min ago", aisle: "D1" },
  { id: "ESL-007", product: "Pasta 500g", lastSync: "1 min ago", aisle: "E3" },
  { id: "ESL-008", product: "Tomato Sauce", lastSync: "2 min ago", aisle: "E4" },
];

const HHTLightOnlineESLs = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-green-600 text-white p-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/HHTLight")} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-lg font-bold">Online ESLs</h1>
            <p className="text-green-100 text-sm">{onlineESLs.length} labels connected</p>
          </div>
        </div>
      </div>

      {/* ESL List */}
      <div className="p-4 space-y-3">
        {onlineESLs.map((esl) => (
          <div
            key={esl.id}
            className="bg-card border border-border rounded-lg p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Wifi className="w-4 h-4 text-green-500" />
                  <span className="font-mono text-sm font-medium">{esl.id}</span>
                </div>
                <p className="font-medium text-foreground">{esl.product}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {esl.lastSync}
                  </span>
                  <span className="flex items-center gap-1">
                    <Package className="w-3 h-3" />
                    Aisle {esl.aisle}
                  </span>
                </div>
              </div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HHTLightOnlineESLs;
