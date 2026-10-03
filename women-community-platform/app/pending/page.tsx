import Link from "next/link";
import { Clock, CheckCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PendingPage() {
  return (
    <div className="min-h-screen bg-lavender-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-card p-10 max-w-lg w-full text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="h-8 w-8 text-amber-600" />
        </div>

        <h1 className="text-2xl font-serif font-semibold text-foreground mb-3">
          Your Application is Under Review
        </h1>
        <p className="text-muted-foreground leading-relaxed mb-8">
          Thank you for registering with Women&apos;s Circle! Our admin team is reviewing your application.
          You&apos;ll receive an email notification once your membership is approved — usually within 24–48 hours.
        </p>

        <div className="bg-lavender-50 rounded-2xl p-5 mb-8 text-left space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-teal-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Registration Complete</p>
              <p className="text-xs text-muted-foreground">Your account has been created successfully.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Admin Review</p>
              <p className="text-xs text-muted-foreground">Your details are being verified by our team.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 opacity-40">
            <Mail className="h-5 w-5 text-purple-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Welcome Email</p>
              <p className="text-xs text-muted-foreground">You&apos;ll receive your welcome email upon approval.</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <Link href="/">
            <Button variant="secondary">Back to Home</Button>
          </Link>
          <Link href="/members">
            <Button>Explore Community</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
