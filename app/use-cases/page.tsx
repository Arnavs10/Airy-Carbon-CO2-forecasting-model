"use client"

import { motion } from "framer-motion"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Landmark, Factory, Users, Lightbulb, Shield } from "lucide-react"

export default function UseCases() {
  const useCases = [
    {
      icon: Landmark,
      title: "Policy Making & Government Planning",
      description:
        "Governments can use emission forecasts to set realistic climate targets, design carbon reduction policies, and allocate resources effectively for environmental programs.",
      benefits: [
        "Evidence-based policy decisions",
        "Long-term climate strategy planning",
        "Budget allocation for green initiatives",
        "International climate agreement compliance",
      ],
    },
    {
      icon: Building2,
      title: "Corporate Sustainability",
      description:
        "Businesses can forecast their carbon footprint, set science-based targets, and demonstrate commitment to stakeholders through data-driven sustainability reporting.",
      benefits: [
        "ESG reporting and compliance",
        "Carbon neutrality roadmap planning",
        "Supply chain emission tracking",
        "Investor confidence and transparency",
      ],
    },
    {
      icon: Factory,
      title: "Industrial Planning",
      description:
        "Manufacturing and energy sectors can anticipate emission trends to optimize operations, invest in clean technology, and stay ahead of regulatory requirements.",
      benefits: [
        "Operational efficiency improvements",
        "Technology investment planning",
        "Regulatory compliance preparation",
        "Cost savings through early adaptation",
      ],
    },
    {
      icon: Users,
      title: "Climate Research & Academia",
      description:
        "Researchers and educational institutions can leverage accurate predictions for climate studies, impact assessments, and developing mitigation strategies.",
      benefits: [
        "Enhanced climate modeling",
        "Impact assessment studies",
        "Educational curriculum development",
        "Cross-disciplinary research collaboration",
      ],
    },
    {
      icon: Lightbulb,
      title: "Innovation & Technology Development",
      description:
        "Tech companies and startups can identify opportunities for carbon capture, renewable energy, and other climate solutions based on emission trajectories.",
      benefits: [
        "Market opportunity identification",
        "Product development guidance",
        "Investment decision support",
        "Innovation prioritization",
      ],
    },
    {
      icon: Shield,
      title: "Risk Management & Insurance",
      description:
        "Financial institutions and insurers can assess climate-related risks, price policies accurately, and develop products for a carbon-constrained future.",
      benefits: [
        "Climate risk assessment",
        "Portfolio diversification strategies",
        "Insurance product development",
        "Long-term financial planning",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Header />
      <main className="container mx-auto px-6 pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Real-World Applications</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-balance">
              Discover how Airy's CO₂ emission predictions drive meaningful action across industries, governments, and
              communities. From policy making to corporate strategy, our forecasts empower informed decisions for a
              sustainable future.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <useCase.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl mb-2">{useCase.title}</CardTitle>
                        <CardDescription className="text-base">{useCase.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-primary">Key Benefits:</p>
                      <ul className="space-y-1">
                        {useCase.benefits.map((benefit, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-2xl">Environmental Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="leading-relaxed">
                  By providing accurate, accessible emission forecasts, Airy enables proactive climate action at every
                  level. Our predictions help organizations and governments move from reactive responses to strategic
                  planning, accelerating the transition to a low-carbon economy.
                </p>
                <div className="grid md:grid-cols-3 gap-4 pt-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold mb-2">3+</p>
                    <p className="text-sm opacity-90">ML Models Combined</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold mb-2">30+</p>
                    <p className="text-sm opacity-90">Years of Data Analyzed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold mb-2">200+</p>
                    <p className="text-sm opacity-90">Countries Covered</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
