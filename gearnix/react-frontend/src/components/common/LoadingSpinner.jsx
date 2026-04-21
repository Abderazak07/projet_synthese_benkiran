export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-48">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500 shadow-[0_0_0_1px_rgba(14,165,233,0.18),0_18px_60px_rgba(0,0,0,0.55)]"></div>
    </div>
  );
}
