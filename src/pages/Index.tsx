
import GitHubLanguageRace from "@/components/GitHubLanguageRace";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#0A0A29] p-4">
      <div className="container mx-auto">
        <GitHubLanguageRace />
        <div className="text-center mt-8 text-white/60 text-sm">
          <p>Data visualizes the ranking of programming languages on GitHub from 2014 to 2024</p>
          <p>Based on count of distinct users contributing to projects of each language</p>
          <p className="mt-4 text-xs text-white/40">
            Hover over lines for more details. Click language names in the legend to show/hide languages.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <a 
              href="https://octoverse.github.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#DD78E8] hover:underline"
            >
              Source: GitHub Octoverse
            </a>
            <span className="text-white/30">|</span>
            <a 
              href="https://echarts.apache.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#3EAFA8] hover:underline"
            >
              Built with Apache ECharts
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
