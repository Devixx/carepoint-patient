"use client";

import {
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  QuestionMarkCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { Button } from "../components/ui/Button";
import BottomNavigation from "../components/navigation/BottomNavigation";
import DesktopSidebar from "../components/navigation/DesktopSidebar";

const supportOptions = [
  {
    title: "Live Chat",
    description: "Chat with our support team in real-time",
    icon: ChatBubbleLeftRightIcon,
    action: "Start Chat",
    available: true,
    hours: "Available 24/7",
  },
  {
    title: "Phone Support",
    description: "Speak directly with a support representative",
    icon: PhoneIcon,
    action: "Call Now",
    available: true,
    hours: "Mon-Fri 8AM-6PM",
  },
  {
    title: "Email Support",
    description: "Send us an email and we'll respond within 24 hours",
    icon: EnvelopeIcon,
    action: "Send Email",
    available: true,
    hours: "Response within 24h",
  },
];

const faqItems = [
  {
    question: "How do I book an appointment?",
    answer:
      'You can book an appointment by clicking "Find Care" or using the quick actions on your dashboard.',
  },
  {
    question: "How do I reschedule my appointment?",
    answer:
      'Go to your appointments page and click "Reschedule" on the appointment you want to change.',
  },
  {
    question: "Where can I view my medical records?",
    answer:
      'All your medical records are available in the "Records" section of your patient portal.',
  },
  {
    question: "What if I need urgent care?",
    answer:
      "For urgent medical needs, please call our 24/7 hotline or visit the nearest emergency room.",
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <DesktopSidebar />

      <div className="lg:ml-64">
        <main className="pb-20 lg:pb-8">
          <div className="p-4 lg:p-8 space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-6 text-white">
              <h1 className="text-3xl font-bold mb-2">Patient Support</h1>
              <p className="text-orange-100 text-lg">
                We&apos;re here to help you with any questions or concerns
              </p>
            </div>

            {/* Emergency Alert */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <ExclamationTriangleIcon className="h-8 w-8 text-red-500 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-bold text-red-900 mb-2">
                    Medical Emergency?
                  </h3>
                  <p className="text-red-700 mb-4">
                    If you&apos;re experiencing a medical emergency, please call
                    emergency services immediately or go to your nearest
                    emergency room.
                  </p>
                  <div className="flex gap-3">
                    <Button className="bg-red-600 hover:bg-red-700">
                      Call Emergency: 112
                    </Button>
                    <Button
                      variant="outline"
                      className="border-red-300 text-red-700 hover:bg-red-50"
                    >
                      Find Hospital
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {supportOptions.map((option) => (
                <div
                  key={option.title}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                      <option.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">
                        {option.title}
                      </h3>
                      <p className="text-sm text-slate-600 flex items-center gap-1">
                        <ClockIcon className="h-3 w-3" />
                        {option.hours}
                      </p>
                    </div>
                  </div>

                  <p className="text-slate-600 mb-6">{option.description}</p>

                  <Button className="w-full" disabled={!option.available}>
                    {option.action}
                  </Button>
                </div>
              ))}
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6">
                Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">
                    CarePoint Medical Center
                  </h4>
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4" />
                      <span>123 Health Street, Luxembourg City</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="h-4 w-4" />
                      <span>+352 26 12 34 56</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <EnvelopeIcon className="h-4 w-4" />
                      <span>support@carepoint.lu</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">
                    Support Hours
                  </h4>
                  <div className="space-y-1 text-sm text-slate-600">
                    <div className="flex justify-between">
                      <span>Monday - Friday:</span>
                      <span>8:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday:</span>
                      <span>9:00 AM - 2:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday:</span>
                      <span>Emergency only</span>
                    </div>
                    <div className="flex justify-between">
                      <span>24/7 Chat:</span>
                      <span>Always available</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <QuestionMarkCircleIcon className="h-6 w-6 text-orange-500" />
                Frequently Asked Questions
              </h3>

              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <details
                    key={index}
                    className="group border border-slate-200 rounded-lg"
                  >
                    <summary className="p-4 cursor-pointer hover:bg-slate-50 font-medium text-slate-900">
                      {item.question}
                    </summary>
                    <div className="px-4 pb-4 text-slate-600 text-sm">
                      {item.answer}
                    </div>
                  </details>
                ))}
              </div>

              <div className="mt-6 p-4 bg-slate-50 rounded-lg text-center">
                <p className="text-slate-600 mb-3">
                  Can&apos;t find what you&apos;re looking for?
                </p>
                <Button variant="outline">Contact Support</Button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <BottomNavigation />
    </div>
  );
}
