import { UserCircle } from "lucide-react";
import { STYLE_GRADIENTS } from "@/data/characterFormOptions";

interface CharacterFormData {
  name: string;
  gender: string;
  ageRange: string;
  skinTone: string;
  faceShape: string;
  eyeColor: string;
  hairStyle: string;
  hairColor: string;
  expression: string;
  outfit: string;
  skinCondition: string;
}

interface Props {
  formData: CharacterFormData;
}

const CharacterPreview = ({ formData }: Props) => {
  const gradient =
    STYLE_GRADIENTS[formData.outfit.toLowerCase()] ||
    "from-gray-800/40 to-neutral-800/40";

  const filledFields = [
    formData.gender && { label: "Gender", value: formData.gender === "female" ? "Wanita" : "Pria" },
    formData.ageRange && { label: "Usia", value: formData.ageRange },
    formData.skinTone && { label: "Kulit", value: formData.skinTone.replace(/_/g, " ") },
    formData.faceShape && { label: "Wajah", value: formData.faceShape },
    formData.eyeColor && { label: "Mata", value: formData.eyeColor },
    formData.hairStyle && { label: "Rambut", value: formData.hairStyle },
    formData.hairColor && { label: "Warna Rambut", value: formData.hairColor },
    formData.expression && { label: "Ekspresi", value: formData.expression.replace(/_/g, " ") },
    formData.outfit && { label: "Outfit", value: formData.outfit },
    formData.skinCondition && { label: "Kulit", value: formData.skinCondition },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-5 min-h-[500px]">
      <p className="text-xs uppercase tracking-widest text-[#666] mb-4 font-satoshi">
        PREVIEW
      </p>

      {/* Avatar area */}
      <div className={`aspect-[3/4] bg-gradient-to-br ${gradient} rounded-xl flex flex-col items-center justify-between p-6 relative overflow-hidden`}>
        <div className="flex-1 flex items-center justify-center">
          <UserCircle className="w-24 h-24 text-white/15" />
        </div>

        {/* Name overlay at top */}
        {formData.name && (
          <div className="absolute top-4 left-4 right-4">
            <p className="text-white font-bold text-lg font-satoshi truncate">
              {formData.name}
            </p>
          </div>
        )}

        {/* Tags overlay at bottom */}
        {(formData.gender || formData.ageRange || formData.outfit) && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-1 text-[12px] text-white/70 flex-wrap">
              {formData.gender && (
                <span>{formData.gender === "female" ? "Wanita" : "Pria"}</span>
              )}
              {formData.ageRange && (
                <>
                  <span className="mx-0.5">•</span>
                  <span>{formData.ageRange}</span>
                </>
              )}
              {formData.outfit && (
                <>
                  <span className="mx-0.5">•</span>
                  <span>{formData.outfit}</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Summary list */}
      {filledFields.length > 0 && (
        <div className="mt-4 flex flex-col gap-1">
          {filledFields.map((field) => (
            <div key={field.label} className="flex items-center gap-2 text-xs">
              <span className="text-[#666]">{field.label}:</span>
              <span className="text-[#999] capitalize">{field.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CharacterPreview;
