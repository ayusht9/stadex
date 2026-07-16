import { RiCustomerService2Line, RiPhoneLine, RiMailLine, RiShieldCrossLine, RiHospitalLine } from 'react-icons/ri';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function Help() {
  const faqs = [
    {
      question: "How do I purchase match tickets?",
      answer: "Official tickets for the FIFA World Cup 2026 can only be purchased through the official FIFA ticketing portal. Please ensure you are logged into your Stadex fan account to view your purchased tickets."
    },
    {
      question: "What items are prohibited in the stadiums?",
      answer: "Prohibited items include large bags, professional cameras, pyrotechnics, laser pointers, and outside food/drink. Please check the specific stadium guide for a comprehensive list."
    },
    {
      question: "Is there accessible seating available?",
      answer: "Yes, all 16 official venues provide dedicated accessible seating, parking, and facilities. You must select 'Accessible Seating' during your ticket purchase."
    },
    {
      question: "How early should I arrive before a match?",
      answer: "We recommend arriving at least 3 hours before kick-off. Gates typically open 4 hours prior, and arriving early ensures you have time for security checks and finding your seat."
    },
    {
      question: "How does the in-app translator work?",
      answer: "Our offline translator uses a secure, on-device AI model (M2M100). It allows you to translate between English, Spanish, French, Portuguese, and German without needing an internet connection."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center">
          <RiCustomerService2Line className="mr-3 h-8 w-8 text-primary" />
          Help & Support
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Find answers to common questions and access emergency contact information for the 2026 tournament.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* FAQ Section */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Quick answers for fans and staff.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-gray-600 dark:text-gray-400">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Contacts */}
        <div className="space-y-6">
          <Card className="border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10">
            <CardHeader>
              <CardTitle className="text-red-700 dark:text-red-400 flex items-center">
                <RiShieldCrossLine className="mr-2 h-5 w-5" />
                Emergency Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <RiPhoneLine className="mt-1 mr-3 h-5 w-5 text-red-600 dark:text-red-400" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Police / Fire / Ambulance</p>
                  <p className="text-sm text-gray-500">Dial 911 (US/Canada) or 911 (Mexico)</p>
                </div>
              </div>
              <div className="flex items-start">
                <RiHospitalLine className="mt-1 mr-3 h-5 w-5 text-red-600 dark:text-red-400" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Stadium Medical Room</p>
                  <p className="text-sm text-gray-500">Locate the Red Cross signs on the concourse level.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <RiCustomerService2Line className="mr-2 h-5 w-5" />
                Stadex Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <RiMailLine className="mr-3 h-5 w-5 text-gray-400" />
                <span className="text-sm">support@stadex2026.com</span>
              </div>
              <div className="flex items-center">
                <RiPhoneLine className="mr-3 h-5 w-5 text-gray-400" />
                <span className="text-sm">+1 (800) 555-0199</span>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
