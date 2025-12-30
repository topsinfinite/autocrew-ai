import { Target, Users, Rocket, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About AutoCrew
          </h1>
          <p className="text-xl text-muted-foreground">
            We're on a mission to make AI automation accessible to every business,
            helping them scale operations and deliver exceptional customer experiences.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto mb-20">
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
              <Target className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              To empower businesses of all sizes with intelligent AI crews that automate
              repetitive tasks, enhance customer support, and drive revenue growth through
              automated lead generation.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-secondary/10 text-secondary mb-4">
              <Rocket className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="text-muted-foreground leading-relaxed">
              A world where every business has access to AI-powered automation, enabling
              them to focus on what matters most—innovation, creativity, and building
              meaningful relationships with their customers.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="max-w-6xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Customer-First</h3>
              <p className="text-muted-foreground">
                Every decision we make puts our customers' success at the forefront.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Simplicity</h3>
              <p className="text-muted-foreground">
                We believe powerful technology should be simple and accessible to everyone.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <Rocket className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-muted-foreground">
                We continuously push boundaries to deliver cutting-edge AI solutions.
              </p>
            </div>
          </div>
        </div>

        {/* Story */}
        <div className="max-w-4xl mx-auto bg-muted/50 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              AutoCrew was born from a simple observation: businesses were struggling
              to keep up with customer demands while managing limited resources. Support
              teams were overwhelmed, leads were slipping through the cracks, and growth
              was constrained by manual processes.
            </p>
            <p>
              We knew AI could solve these problems, but existing solutions were too
              complex, too expensive, or required extensive technical expertise. So we
              set out to build something different—an AI automation platform that anyone
              could use, regardless of technical background.
            </p>
            <p>
              Today, AutoCrew powers thousands of businesses worldwide, handling millions
              of customer conversations and generating qualified leads around the clock.
              But we're just getting started. Our vision is to democratize AI automation,
              making it as accessible as email or spreadsheets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
