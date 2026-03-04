import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { question: "How much work do I have to do as the creator?", answer: "You provide 1–3 short videos or pieces of content based on your expertise. Esther handles everything else — product structure, backend systems, landing pages, email sequences, and launch operations." },
  { question: "What happens during the first call?", answer: "We'll discuss your audience, niche, and content to identify the most monetizable topic. If it's a fit, we'll outline the product structure and timeline. The call is 15 minutes, zero pressure." },
  { question: "How does the 70/30 split work?", answer: "You keep 70% of all revenue generated. Esther takes 30%. No upfront costs, no hidden fees, no monthly subscriptions. We only succeed when you succeed." },
  { question: "Is this a monthly fee or one-time partnership?", answer: "This is a revenue-share partnership, not a service fee. There's no monthly cost and no upfront payment." },
  { question: "Do I need to record long videos?", answer: "No. Most creators provide 1–3 short videos (5–15 minutes each). Esther uses AI-accelerated workflows to turn that into a full, structured digital product." },
  { question: "How long does a product take to build?", answer: "Typically 7–14 days from topic selection to launch-ready product. This includes the product blueprint, backend build, landing page, email system, and delivery setup." },
  { question: "Can beginners apply?", answer: "Yes, as long as you have an engaged audience and clear expertise in a specific niche. You don't need prior product experience or technical skills." },
  { question: "What platforms do you use?", answer: "Esther uses modern, scalable platforms for product delivery, payments, and email automation. We select the best tools for your audience size and product type." },
  { question: "How do I know if my audience will buy?", answer: "During the discovery call, we analyze your content engagement, audience behavior, and niche demand to identify monetizable topics before building." },
  { question: "What if I've never launched anything before?", answer: "That's exactly who this is for. Esther removes the operational burden so first-time creators can focus on what they do best: creating content." },
];

const FAQ = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked <span className="text-gradient-blue-olive">Questions</span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass-card px-6 border-none reactive"
              >
                <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
