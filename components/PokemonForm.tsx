'use client'

import TextField from "@/components/TextField";
import {SubmitButton} from "@/components/SubmitButton";

export default function PokemonForm() {
    return (
        <div className="flex flex-row gap-4 items-center sm:items-start sm:text-left">
            <TextField></TextField>
            <SubmitButton onClick={() => console.log("CIAO!")}></SubmitButton>
        </div>
    );
}

