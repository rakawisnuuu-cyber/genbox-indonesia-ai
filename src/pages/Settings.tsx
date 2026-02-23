import ProfileSection from "@/components/settings/ProfileSection";
import ApiKeysSection from "@/components/settings/ApiKeysSection";
import BlueprintSection from "@/components/settings/BlueprintSection";
import AccountSection from "@/components/settings/AccountSection";

const sectionDelay = (i: number) => ({ animationDelay: `${i * 100}ms` });

const Settings = () => {
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-white uppercase tracking-wider font-satoshi">
        PENGATURAN
      </h1>

      <section className="animate-fade-up" style={sectionDelay(0)}>
        <ProfileSection />
      </section>

      <section className="animate-fade-up" style={sectionDelay(1)}>
        <ApiKeysSection />
      </section>

      <section className="animate-fade-up" style={sectionDelay(2)}>
        <BlueprintSection />
      </section>

      <section className="animate-fade-up pb-8" style={sectionDelay(3)}>
        <AccountSection />
      </section>
    </div>
  );
};

export default Settings;
