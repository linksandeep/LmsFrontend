interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
}

class PerformanceService {
  private metrics: PerformanceMetric[] = [];
  private isEnabled = process.env.NODE_ENV === 'production';

  // Track page load time
  trackPageLoad() {
    if (!this.isEnabled) return;

    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.logMetric('page-load', navigation.loadEventEnd - navigation.startTime);
      }
    });
  }

  // Track component render time
  trackRender(componentName: string, startTime: number) {
    if (!this.isEnabled) return;
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    this.logMetric(`render-${componentName}`, renderTime);
  }

  // Track API call time
  trackApiCall(endpoint: string, startTime: number) {
    if (!this.isEnabled) return;
    
    const endTime = performance.now();
    const callTime = endTime - startTime;
    this.logMetric(`api-${endpoint}`, callTime);
  }

  // Log metric
  private logMetric(name: string, value: number) {
    const metric: PerformanceMetric = {
      name,
      value: Math.round(value),
      timestamp: Date.now()
    };
    
    this.metrics.push(metric);
    
    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(metric);
    } else {
      console.log(`[Performance] ${name}: ${value.toFixed(2)}ms`);
    }
  }

  // Send to analytics (implement based on your analytics service)
  private sendToAnalytics(metric: PerformanceMetric) {
    // Implement your analytics service here
    // Example: send to Google Analytics, Mixpanel, etc.
  }

  // Get all metrics
  getMetrics() {
    return this.metrics;
  }

  // Clear metrics
  clearMetrics() {
    this.metrics = [];
  }
}

export const performanceService = new PerformanceService();
