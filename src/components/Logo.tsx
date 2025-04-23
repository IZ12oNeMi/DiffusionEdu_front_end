import logo from '../assets/react.svg'; // 占位 logo，需替换

export function Logo() {
    return (
        <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="w-10 h-10" />
            <h1 className="text-xl font-bold text-neutral-900">Diffusion Edu</h1>
        </div>
    );
}