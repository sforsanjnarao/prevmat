import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { features } from "@/data/features"; 

const FeaturesSection = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-transparent"> {/* Added subtle background */}
      <div className="container mx-auto px-8 md:px-6">
        <div className="max-w-xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="text-2xl font-bold track sm:text-3xl md:text-4xl">
            Protect What Matters Most 
            <br />
            - Your Privacy
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-9 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border rounded-2xl bg-slate-800/30 p-6 shadow-md transition hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/20 duration-300 flex flex-col text-center items-center dark:border-gray-800 dark:bg-gray-800/30"
            >
              <CardContent className="pt px-0 flex flex-col items-center flex-grow">
                {/* Icon container with cleaner background */}
                {/* <div className="mb-6  rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center"> */}
                  {feature.icon}
                {/* </div> */}

                {/* Feature Title */}
                <h3 className="text-lg font-semibold mb-2 text-white">{feature.title}</h3>

                {/* Feature Description */}
                <p className="text-sm text-muted-foreground text-center">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
