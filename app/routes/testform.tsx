import { ActionFunctionArgs } from "@remix-run/node";
import { Form, useSubmit } from "@remix-run/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import React, { FormEvent } from "react";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  console.log(formData.get("name"));
  console.log(formData.get("email"));

  return {
    headers: {
      "Cache-Control": "no-cache",
    },
  };
}

export default function Page() {
  const [formData, setFormData] = React.useState<FormData>();
  const [show, setShow] = React.useState(false);
  const submit = useSubmit();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    console.log("handleSubmit");
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setFormData(formData);
    setShow(true);
  }

  function onConfirmed() {
    if (formData) {
      submit(formData, {
        method: "post",
      });
    }
  }

  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <input type="text" name="name" />
      <input type="text" name="email" />
      <button type="submit">Submit</button>
      <AlertDialogDemo
        show={show}
        setShow={setShow}
        onYes={onConfirmed}
        message="lorem ipsum"
      />
    </Form>
  );
}

function AlertDialogDemo({
  show,
  onYes,
  setShow,
  message,
}: {
  show: boolean;
  onYes: () => void;
  setShow: (show: boolean) => void;
  message: string;
}) {
  return (
    <AlertDialog open={show}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setShow(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onYes();
              setShow(false);
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
