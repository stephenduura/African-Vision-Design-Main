import { useSubmitContact } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Mail, Phone } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(5, "Subject is required"),
  message: z.string().min(10, "Message is required"),
});

export default function Contact() {
  const submitContact = useSubmitContact();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    submitContact.mutate(
      { data: values },
      {
        onSuccess: () => {
          toast({ title: "Message Sent", description: "Thank you for reaching out. We will respond shortly." });
          form.reset();
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" });
        }
      }
    );
  };

  return (
    <div className="bg-background pt-24 pb-32">
      <div className="container mx-auto px-4">
        
        <div className="max-w-3xl mx-auto text-center mb-24">
          <h1 className="text-5xl md:text-6xl font-serif text-primary mb-6">Get in Touch</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Whether you're a potential partner, donor, or media representative, we want to hear from you.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-16">
          
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-2xl font-serif text-primary mb-8">Global Headquarters</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-serif text-lg mb-1">Abuja, Nigeria</h3>
                    <p className="text-muted-foreground text-sm">Flat 2 Bahamas Estate, Opposite Grandpela<br/>Durumi District, Abuja</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="w-6 h-6 text-primary shrink-0" />
                  <a href="mailto:contact@papifoundation.net" className="text-muted-foreground hover:text-primary transition-colors text-sm">contact@papifoundation.net</a>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="w-6 h-6 text-primary shrink-0" />
                  <a href="tel:+31642032437" className="text-muted-foreground hover:text-primary transition-colors text-sm">+31 6 42032437</a>
                </div>
              </div>
            </div>

            <div className="pt-12 border-t border-border/50">
              <h2 className="text-2xl font-serif text-primary mb-8">Regional Offices</h2>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-serif text-md mb-1">Nairobi, Kenya</h3>
                    <p className="text-muted-foreground text-sm">Westlands Business Park</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-serif text-md mb-1">London, UK</h3>
                    <p className="text-muted-foreground text-sm">Global Partnerships Desk</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-card border border-border p-8 md:p-12">
              <h2 className="text-2xl font-serif text-primary mb-8">Send a Message</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Name</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-background border-border focus-visible:ring-primary h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} className="bg-background border-border focus-visible:ring-primary h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Phone (Optional)</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-background border-border focus-visible:ring-primary h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Subject</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-background border-border focus-visible:ring-primary h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Message</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="bg-background border-border focus-visible:ring-primary min-h-[150px] resize-y" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={submitContact.isPending} className="w-full h-14 text-sm tracking-widest uppercase bg-primary hover:bg-primary/90 text-primary-foreground rounded-none mt-4">
                    {submitContact.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
