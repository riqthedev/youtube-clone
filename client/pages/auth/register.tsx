import {
    Button,
    Container,
    Paper,
    PasswordInput,
    Stack,
    TextInput,
    Title,
  } from "@mantine/core";
  import { useForm } from "@mantine/form";
  import { showNotification, updateNotification } from "@mantine/notifications";
  import { AxiosError } from "axios";
  import Head from "next/head";
  import { useRouter } from "next/router";
  import { ReactElement } from "react";
  import { useMutation } from "react-query";
  import { registerUser } from "../../api";
  
  function RegisterPage() {
    const router = useRouter();
  
    const form = useForm({
      initialValues: {
        email: "",
        username: "",
        password: "",
       
      },
    });
  
    const mutation = useMutation<
      string,
      AxiosError,
      Parameters<typeof registerUser>["0"]
    >(registerUser, {
      onMutate: () => {
        showNotification({
          id: "register",
          title: "Creating account",
          message: "Please wait...",
          loading: true,
        });
      },
      onSuccess: () => {
        updateNotification({
          id: "register",
          title: "Success",
          message: "Successfully created account",
        });
  
        router.push("/auth/login");
      },
      onError: () => {
        updateNotification({
          id: "register",
          title: "Error",
          message: "Could not create account",
        });
      },
    });
  
    return (
      <>
        <Head>
          <title>Register User</title>
        </Head>
        <Container>
          <Title>Register</Title>
  
          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
              <Stack>
                <TextInput
                  label="Email"
                  placeholder="riq@example.com"
                  required
                  {...form.getInputProps("email")}
                />
                <TextInput
                  label="Username"
                  placeholder="showtimeriq"
                  required
                  {...form.getInputProps("username")}
                />
                <PasswordInput
                  label="Password"
                  placeholder="at least 6 characters"
                  required
                  {...form.getInputProps("password")}
                />
              
  
                <Button type="submit">Register</Button>
              </Stack>
            </form>
          </Paper>
        </Container>
      </>
    );
  }
  
  export default RegisterPage;