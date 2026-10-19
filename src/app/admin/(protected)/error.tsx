"use client";
export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <div className="admin-empty" role="alert"><span aria-hidden="true">!</span><h2>Something went wrong</h2><p>The administration request could not be completed safely.</p><button className="admin-button" type="button" onClick={reset}>Try Again</button></div>; }
