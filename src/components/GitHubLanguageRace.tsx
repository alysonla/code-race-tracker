
import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { githubLanguageData, yearLabels } from '@/data/githubLanguageData';
import { cn } from '@/lib/utils';

const GitHubLanguageRace: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (chartRef.current && !isInitialized) {
      // Initialize chart with appropriate renderer
      chartInstance.current = echarts.init(chartRef.current, undefined, {
        renderer: 'canvas'
      });
      
      setIsInitialized(true);

      // Handle resize
      const handleResize = () => {
        chartInstance.current?.resize();
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chartInstance.current?.dispose();
      };
    }
  }, [isInitialized]);

  useEffect(() => {
    if (chartInstance.current && isInitialized) {
      // Set options
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
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 100,
          bottom: 10,
          textStyle: {
            color: '#fff'
          },
          selected: githubLanguageData.reduce((acc, item) => {
            acc[item.name] = true;
            return acc;
          }, {} as Record<string, boolean>),
          icon: 'roundRect',
          itemWidth: 15,
          itemHeight: 8
        },
        grid: {
          left: 70,
          right: 120,
          top: 90,
          bottom: 50
        },
        xAxis: {
          type: 'category',
          data: ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
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
          z: 10 - Math.min(...item.values) // Higher-ranked languages will be on top
        })),
        animationDuration: 1500,
        animationEasing: 'cubicOut',
        animationDelay: (idx: number) => idx * 100
      };

      // Apply options
      chartInstance.current.setOption(option);
    }
  }, [isInitialized]);

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
