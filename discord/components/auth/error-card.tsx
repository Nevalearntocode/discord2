import Header from "@/components/auth/header";

import React from "react";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import BackButton from "./back-button";

const ErrorCard = () => {
  return (
    <Card className="lg:w-1/4 md:w-1/2 w-3/4 shadow-md bg-zinc-200 dark:bg-zinc-800">
      <CardHeader>
        <Header label="Oops! something went wrong!" />
      </CardHeader>
      <CardFooter>
        <BackButton href="/auth/login" label="Back to login" />
      </CardFooter>
    </Card>
  );
};

export default ErrorCard;
