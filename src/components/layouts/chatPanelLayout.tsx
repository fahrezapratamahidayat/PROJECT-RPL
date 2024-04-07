export default function ChatPanelLayout({children} : {children: React.ReactNode}){
    return (
        <>
        <div className="flex gap-2 items-start h-full">
            {children}
        </div>
        </>
    )
}