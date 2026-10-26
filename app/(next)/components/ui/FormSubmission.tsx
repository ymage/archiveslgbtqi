/* eslint-disable react/no-unescaped-entities */
"use client";

import { useForm, SubmitHandler } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { toast } from "sonner";
import { ContactFormSchema } from "../../lib/schema";
import { sendEmail } from "../../_actions";

export type ContactFormInputs = z.infer<typeof ContactFormSchema>;

export default function FormSubmission() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInputs>({
    resolver: zodResolver(ContactFormSchema),
  });

  const processForm: SubmitHandler<ContactFormInputs> = async (data) => {
    const result = await sendEmail(data);

    if (result?.success) {
      // console.log({ data: result.data?.data });
      toast.success("Archive envoyée avec succès!");
      reset();
      return;
    }

    if (result && "rateLimited" in result && result.rateLimited) {
      toast.error("Trop de demandes, réessayez plus tard.");
      return;
    }

    // toast error
    // console.log(result?.error);
    toast.error("Une erreur s'est produite lors de l'envoi de l'archive.");
  };

  return (
    <form
      onSubmit={handleSubmit(processForm)}
      className="relative flex h-full w-full flex-col gap-[.5rem] lg:w-[55%]"
    >
      <input
        aria-label="Nom"
        placeholder="Nom"
        {...register("name")}
        className="FormSubmitInput h-[2.15rem] lg:h-[2.15rem]"
      />

      <input
        aria-label="Adresse email"
        placeholder="Adresse email"
        {...register("email")}
        className="FormSubmitInput h-[2.15rem] lg:h-[2.15rem]"
      />

      <input
        aria-label="Titre de votre archive"
        placeholder="Titre de votre archive"
        {...register("title")}
        className="FormSubmitInput h-[2.15rem] lg:h-[2.15rem]"
      />

      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        {...register("website")}
      />

      <textarea
        rows={5}
        cols={5}
        placeholder="Message"
        {...register("message")}
        className="FormSubmitInput mt-[-.5rem] resize-none"
      />
      {errors.name?.message && (
        <p className="font-jetbrains text-[.7rem] leading-[.5rem] tracking-tighter">
          Le nom est requis.
        </p>
      )}
      {errors.email?.message && (
        <p className="font-jetbrains text-[.7rem] leading-[.5rem] tracking-tighter">
          L'adresse email est requise.
        </p>
      )}
      {errors.title?.message && (
        <p className="font-jetbrains text-[.7rem] leading-[.5rem] tracking-tighter">
          Le titre est requis.
        </p>
      )}
      {errors.message?.message && (
        <p className="font-jetbrains text-[.7rem] leading-[.5rem] tracking-tighter">
          Le message est requis.
        </p>
      )}
      <div className="flex w-full items-center justify-end">
        <button
          aria-label="Envoyer"
          disabled={isSubmitting}
          className="w-auto bg-black px-[1rem] py-[.5rem] font-jetbrains text-[.8rem] uppercase tracking-wider text-white hover:text-pink-arch"
        >
          {isSubmitting ? "..." : "Envoyer"}
        </button>
      </div>
    </form>
  );
}
