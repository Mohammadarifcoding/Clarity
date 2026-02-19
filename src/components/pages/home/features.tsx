import { features } from "@/src/data/features";

const Features = () => {
  return (
    <section className="section bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="mb-4">
            Everything you need to{" "}
            <span className="font-normal text-(--color-green)">
              stay focused
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Clarity handles the details so you can concentrate on what
            matters—the conversation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card group">
              <div className="feature-icon mb-6">
                {<feature.Icon className="w-6 h-6" />}
              </div>
              <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-2xl p-12 border border-gray-200">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-light text-(--color-green) mb-2">
                99%
              </div>
              <div className="text-sm text-gray-600">
                Transcription Accuracy
              </div>
            </div>
            <div>
              <div className="text-4xl font-light text-(--color-green) mb-2">
                &lt;2s
              </div>
              <div className="text-sm text-gray-600">Processing Time</div>
            </div>
            <div>
              <div className="text-4xl font-light text-(--color-green) mb-2">
                50+
              </div>
              <div className="text-sm text-gray-600">Languages Supported</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
