import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  { question: "How much work do I have to do as the creator?", answer: "You provide 1–3 short videos or pieces of content based on your expertise. Esther handles everything else — product structure, backend systems, landing pages, email sequences, and launch operations." },
  { question: "What happens during the first call?", answer: "We'll discuss your audience, niche, and content to identify the most monetizable topic. If it's a fit, we'll outline the product structure and timeline. The call is 15 minutes, zero pressure." },
  { question: "How does the commission work?", answer: "There's no upfront cost. Esther takes a negotiable commission on revenue generated. No hidden fees, no monthly subscriptions. We only succeed when you succeed." },
  { question: "Do I need to record long videos?", answer: "No. Most creators provide 1–3 short videos (5–15 minutes each). Esther uses AI-accelerated workflows to turn that into a full, structured digital product." },
  { question: "How long does a product take to build?", answer: "Typically 7–14 days from topic selection to launch-ready product. This includes the product blueprint, backend build, landing page, email system, and delivery setup." },
  { question: "Can beginners apply?", answer: "Yes, as long as you have an engaged audience and clear expertise in a specific niche. You don't need prior product experience or technical skills." },
  { question: "What if I've never launched anything before?", answer: "That's exactly who this is for. Esther removes the operational burden so first-time creators can focus on what they do best: creating content." },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-20 relative">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked <span className="text-gradient-blue-olive">Questions</span>
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.15 + index * 0.1 }}
              >
                <AccordionItem
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
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
