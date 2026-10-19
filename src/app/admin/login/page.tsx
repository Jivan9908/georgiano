import { redirect } from "next/navigation";
import { loginAction } from "../actions/auth-actions";
import { getCurrentAdmin } from "@/lib/server/auth/session";
import "../admin.css";

export default async function AdminLoginPage({ searchParams }: PageProps<"/admin/login">) {
  if (await getCurrentAdmin()) redirect("/admin");
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : "";
  return <main className="admin-login"><section><div className="admin-login__brand"><span>G</span><div><strong>GEORGIANO</strong><small>Administration</small></div></div><p className="admin-kicker">Secure access</p><h1>Welcome back.</h1><p>Sign in with your administrator credentials.</p>{error ? <p className="admin-notice admin-notice--error" role="alert">{error === "rate-limited" ? "Too many attempts. Try again in 15 minutes." : "Invalid email or password."}</p> : null}<form action={loginAction}><label>Email<input type="email" name="email" autoComplete="username" required /></label><label>Password<input type="password" name="password" autoComplete="current-password" required /></label><button className="admin-button" type="submit">Sign In</button></form><small>No public registration is available.</small></section></main>;
}
