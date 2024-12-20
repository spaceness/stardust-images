const themes = ["light", "dark"];
function setInitialTheme() {
	const root = window.document.documentElement;
	const theme = localStorage.theme;
	if (!theme) {
		localStorage.theme = "system";
	}
	if (theme === "system") {
		const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
		root.classList.add(systemTheme);
		return;
	}
	root.classList.add(theme);
}
setInitialTheme();
function setTheme() {
	const theme = localStorage.theme;
	const currentIndex = themes.indexOf(theme);
	const nextIndex = (currentIndex + 1) % themes.length;
	localStorage.theme = themes[nextIndex];
	const root = window.document.documentElement;
	root.classList.remove(...themes);
	root.classList.add(themes[nextIndex]);
}

window.addEventListener("load", () => {
	fetch("/password")
		.then((res) => res.text())
		.then((data) => {
			document.getElementById("vncpasswd").innerText = data;
		});
	fetch("/files/list")
		.then((res) => res.json())
		.then((/** @type {String[]} */ data) => {
			if (data.length === 0) {
				document.getElementById("fileslist").innerHTML = `
                <div class="relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground">
                  <i data-lucide="info" class="size-4"></i>
                <p class="mb-1 font-medium leading-none tracking-tight">There are no files in the container.</p>
                <p class="text-sm [&_p]:leading-relaxed">Upload files to the container to see them here.</p>
                </div>
                `;
				lucide.createIcons();
				return;
			}
			for (const file of data) {
				const el = `
               <div class="rounded-lg border bg-card text-card-foreground shadow-sm flex justify-between items-center p-4 h-16 w-auto gap-2 mt-2">
                  <i data-lucide="file" className="size-5 flex-shrink-0"></i>
                  <span className="text-sm truncate overflow-x-scroll">${file}</span>
                  <a href="/files/download/${file}" download="${file}" class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-10">
                    <i data-lucide="download"></i>
                  </a>
                </div>
               `;
				if (i !== 0) {
					document.getElementById("fileslist").innerHTML += el;
				} else {
					document.getElementById("fileslist").innerHTML = el;
				}
				lucide.createIcons();
			}
		});
});
