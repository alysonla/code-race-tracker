import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { githubLanguageData, yearLabels } from '@/data/githubLanguageData';
import { cn } from '@/lib/utils';

const GitHubLanguageRace: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    };
    
    window.addEventListener('resize', handleResize);

    if (chartRef.current && !chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current, undefined, {
        renderer: 'canvas'
      });
      
      const option: echarts.EChartsOption = {
        title: {
          text: 'Top programming languages on GitHub',
          subtext: 'RANKED BY COUNT OF DISTINCT USERS CONTRIBUTING TO PROJECTS OF EACH LANGUAGE.',
          left: 'center',
          top: 20,
          textStyle: {
            color: '#fff',
            fontSize: 28,
            fontWeight: 'bold',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
          },
          subtextStyle: {
            color: '#aaa',
            fontSize: 14,
            fontFamily: 'monospace'
          }
        },
        backgroundColor: '#0A0A29',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          backgroundColor: 'rgba(10, 10, 41, 0.9)',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          textStyle: {
            color: '#fff'
          }
        },
        grid: {
          left: 70,
          right: 120,
          top: 90,
          bottom: 50
        },
        xAxis: {
          type: 'category',
          data: yearLabels,
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.3)'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#fff',
            fontSize: 14
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.1)',
              type: 'dashed'
            }
          }
        },
        yAxis: {
          type: 'value',
          min: 1,
          max: 10,
          inverse: true,
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.3)'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#fff',
            fontSize: 14,
            formatter: '{value}'
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.1)',
              type: 'dashed'
            }
          }
        },
        series: githubLanguageData.map(item => ({
          name: item.name,
          type: 'line',
          symbol: 'circle',
          symbolSize: 10,
          sampling: 'average',
          itemStyle: {
            color: item.color
          },
          lineStyle: {
            width: 4,
            color: item.color,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowBlur: 5
          },
          emphasis: {
            focus: 'series',
            lineStyle: {
              width: 6
            },
            itemStyle: {
              borderWidth: 3
            }
          },
          data: item.values,
          endLabel: {
            show: true,
            formatter: '{a}',
            color: '#fff',
            fontSize: 14,
            fontWeight: 'bold',
            backgroundColor: item.color,
            padding: [5, 8],
            borderRadius: 3
          },
          z: 10 - Math.min(...item.values)
        })),
        animationDuration: 3000,
        animationEasing: 'cubicInOut',
        animationDelay: (idx: number) => idx * 200
      };

      chartInstance.current.setOption(option);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="w-full h-full bg-[#0A0A29] rounded-lg shadow-xl overflow-hidden border border-white/10">
      <div className="p-4 sm:p-0">
        <div 
          ref={chartRef} 
          className={cn(
            "w-full", 
            "h-[500px] sm:h-[600px] md:h-[700px]",
            "touch-auto"
          )} 
          aria-label="GitHub programming languages popularity trend from 2014 to 2024"
          role="img"
        />
      </div>
    </div>
  );
};

export default GitHubLanguageRace;
