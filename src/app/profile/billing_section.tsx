import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getUserPurchasedTemplates, getUserPurchaseHistory } from "@/services/template-service";
import { resumeTemplates } from "@/lib/resume-templates";
import { BookTemplate, Receipt, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// Add this to the subscription tab in src/app/profile/page.tsx
export function BillingSection() {
  const [purchasedTemplates, setPurchasedTemplates] = useState<string[]>([]);
  const [purchaseHistory, setPurchaseHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPurchaseData() {
      setIsLoading(true);
      try {
        const [templates, history] = await Promise.all([
          getUserPurchasedTemplates(),
          getUserPurchaseHistory()
        ]);
        setPurchasedTemplates(templates);
        setPurchaseHistory(history);
      } catch (error) {
        console.error("Error loading purchase data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadPurchaseData();
  }, []);

  const getTemplateName = (templateId: string) => {
    const template = resumeTemplates.find(t => t.id === templateId);
    return template?.name || templateId;
  };

  return (
    <>
      <div className="space-y-6">
        {/* Purchased Templates Section */}
        <div className="space-y-4">
          <h3 className="font-medium flex items-center">
            <BookTemplate className="h-5 w-5 mr-2 text-blue-500" /> Your Templates
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {purchasedTemplates.map(templateId => {
              const template = resumeTemplates.find(t => t.id === templateId);
              if (!template) return null;
              
              return (
                <Card key={templateId} className="p-4 flex items-center gap-3">
                  <div 
                    className="h-10 w-10 rounded flex-shrink-0"
                    style={{ backgroundColor: template.colors.primary }}
                  ></div>
                  <div className="flex-grow">
                    <div className="font-medium">{template.name}</div>
                    <div className="text-xs text-muted-foreground">{template.description || "Professional template"}</div>
                  </div>
                  <Badge variant={templateId === 'classic' ? "outline" : "default"}>
                    {templateId === 'classic' ? "Free" : "Premium"}
                  </Badge>
                </Card>
              );
            })}
            
            {purchasedTemplates.length === 0 && !isLoading && (
              <div className="col-span-2 bg-muted p-4 rounded-md text-center">
                <p className="text-muted-foreground">You haven't purchased any premium templates yet.</p>
              </div>
            )}
            
            {isLoading && (
              <div className="col-span-2 bg-muted p-4 rounded-md text-center animate-pulse">
                <div className="h-6 bg-muted-foreground/20 rounded w-2/3 mx-auto"></div>
              </div>
            )}
          </div>
          
          <Button asChild variant="outline" className="w-full">
            <Link href="/templates">
              <Sparkles className="mr-2 h-4 w-4 text-amber-500" /> Browse More Templates
            </Link>
          </Button>
        </div>
        
        <Separator />
        
        {/* Purchase History Section */}
        <div className="space-y-4">
          <h3 className="font-medium flex items-center">
            <Receipt className="h-5 w-5 mr-2 text-blue-500" /> Purchase History
          </h3>
          
          {purchaseHistory.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-medium">Template</th>
                    <th className="text-left p-3 font-medium">Date</th>
                    <th className="text-right p-3 font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {purchaseHistory.map((purchase) => (
                    <tr key={purchase.id}>
                      <td className="p-3">{getTemplateName(purchase.template_id)}</td>
                      <td className="p-3 text-muted-foreground">
                        {new Date(purchase.purchased_at).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-right">${purchase.amount_paid.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : !isLoading ? (
            <div className="bg-muted p-4 rounded-md text-center">
              <p className="text-muted-foreground">No purchase history found.</p>
            </div>
          ) : (
            <div className="space-y-2 animate-pulse">
              <div className="h-10 bg-muted-foreground/20 rounded"></div>
              <div className="h-10 bg-muted-foreground/20 rounded"></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}