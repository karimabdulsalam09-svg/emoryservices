import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How much work do I have to do as the creator?",
    answer: "You provide 1–3 short videos or pieces of content based on your expertise. Optima handles everything else — product structure, backend systems, landing pages, email sequences, and launch operations. Your only job is to be the expert and stay focused on your content.",
  },
  {
    question: "What happens during the first call?",
    answer: "We'll discuss your audience, niche, and content to identify the most monetizable topic. If it's a fit, we'll outline the product structure and timeline. The call is 15 minutes, zero pressure, and designed to ensure alignment before moving forward.",
  },
  {
    question: "How does the 70/30 split work?",
    answer: "You keep 70% of all revenue generated from the product. Optima takes 30%. There are no upfront costs, no hidden fees, and no monthly subscriptions. We only succeed when you succeed, so our incentives are fully aligned.",
  },
  {
    question: "Is this a monthly fee or one-time partnership?",
    answer: "This is a revenue-share partnership, not a service fee. There's no monthly cost and no upfront payment. You pay nothing until the product generates revenue, and then the split applies to ongoing sales.",
  },
  {
    question: "Do I need to record long videos?",
    answer: "No. Most creators provide 1–3 short videos (5–15 minutes each) or equivalent content. Optima uses AI-accelerated workflows to turn that minimal input into a full, structured digital product with all supporting assets.",
  },
  {
    question: "How long does a product take to build?",
    answer: "Typically 7–14 days from topic selection to launch-ready product. This includes the product blueprint, backend build, landing page, email system, and delivery setup. Speed depends on content complexity and your availability for minimal input.",
  },
  {
    question: "Can beginners apply?",
    answer: "Yes, as long as you have an engaged audience and clear expertise in a specific niche. You don't need prior product experience or technical skills. Optima handles the full backend and operational complexity.",
  },
  {
    question: "What platforms do you use to deliver the product?",
    answer: "Optima uses modern, scalable platforms for product delivery, payments, and email automation. We select the best tools for your audience size and product type, and handle all setup and integrations on your behalf.",
  },
  {
    question: "How do I know if my audience will buy?",
    answer: "During the discovery call, we analyze your content engagement, audience behavior, and niche demand to identify monetizable topics. We focus on validating interest before building, so you're launching with confidence, not guesswork.",
  },
  {
    question: "What if I've never launched anything before?",
    answer: "That's exactly who this is for. Optima removes the operational burden so first-time creators can focus on what they do best: creating content. We handle the structure, systems, and backend work that typically causes overwhelm or failure.",
  },
];

const FAQ = () => {
  return (
    <section className="py-32 relative">
      <div className="absolute inset-0 gradient-radial-blue opacity-10" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked <span className="text-gradient-orange-blue">Questions</span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="elite-card rounded-xl px-6 border-none"
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
