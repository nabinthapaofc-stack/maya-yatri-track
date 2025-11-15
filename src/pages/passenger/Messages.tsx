import ChatWidget from "@/components/ChatWidget";
import BottomNav from "@/components/BottomNav";

const PassengerMessages = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <section className="px-6 py-10 text-center space-y-3">
        <p className="text-sm uppercase tracking-[0.35em] text-primary/70">Passenger inbox</p>
        <h1 className="text-3xl md:text-4xl font-semibold text-foreground">Stay in touch with your drivers</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Conversations are available only for buses you have recently ridden. Tap any driver to open the messenger,
          review their profile, or raise a complaint when needed.
        </p>
      </section>

      <section className="px-4 pb-8">
        <ChatWidget variant="page" />
      </section>

      <BottomNav role="passenger" />
    </div>
  );
};

export default PassengerMessages;
