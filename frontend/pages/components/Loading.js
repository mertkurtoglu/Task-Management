export default function LoadingScreen() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-base-100">
            <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
            <p className="text-sm text-base-500">loading, please wait...</p>
        </div>
    );
}
