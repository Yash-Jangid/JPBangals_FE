import { BASE_URL_MOBILE, API_KEY, API_ENDPOINTS } from '../common/constants';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  notifications?: any[];
}

interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  timeout?: number; // Timeout in milliseconds
}

interface MeetingListItem {
  id: number;
  title: string;
  instructor: string;
  student: string;
  date: string;
  time: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  amount: number;
  meeting_type: string;
  created_at: string;
}

interface Instructor {
  id: number;
  full_name: string;
  avatar?: string;
  email: string;
  bio?: string;
  rating?: number;
  verified?: boolean;
}

interface Meeting {
  id: number;
  title: string;
  description: string;
  amount: number;
  in_person_amount?: number;
  discount?: number;
  creator_id: number;
  group_meeting: boolean;
  in_person: boolean;
  online_group_max_student?: number;
  online_group_min_student?: number;
  online_group_amount?: number;
  in_person_group_max_student?: number;
  in_person_group_min_student?: number;
  in_person_group_amount?: number;
  disabled: boolean;
  creator: Instructor;
  meeting_times: MeetingTime[];
}

interface MeetingTime {
  id: number;
  meeting_id: number;
  day_label: string;
  time: string;
  meeting_type: 'online' | 'in_person' | 'all';
  description?: string;
}

interface AvailableSlot {
  date: string;
  available: boolean;
  reserved?: boolean;
}


class ApiService {
  private baseUrl: string;
  private apiKey: string;
  private activeRequests: AbortController[] = [];

  constructor() {
    this.baseUrl = BASE_URL_MOBILE;
    this.apiKey = API_KEY;
  }

  private getDefaultHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-api-key': this.apiKey,
    };
  }

  private requiresAuthentication(endpoint: string): boolean {
    // List of endpoints that don't require authentication
    const publicEndpoints = [
      '/mobile/login',
      '/mobile/register',
      '/config',
      '/mobile/categories',
      '/mobile/live-courses',
      '/fcm-token',
      '/mobile/social-config',
      '/mobile/google-login',
      '/mobile/facebook-login'
    ];

    // Check if the endpoint starts with any of the public endpoints
    return !publicEndpoints.some(publicEndpoint => endpoint.startsWith(publicEndpoint));
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public cancelAllRequests(): void {
    console.log(`Cancelling ${this.activeRequests.length} active API requests`);
    this.activeRequests.forEach(controller => {
      try {
        controller.abort();
      } catch (error) {
        console.error('Error aborting request:', error);
      }
    });
    this.activeRequests = [];
  }

  async request<T = any>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      body,
      headers = {},
      timeout = 15000 // 15 second timeout for production stability
    } = options;

    // Check if this endpoint requires authentication
    const requiresAuth = this.requiresAuthentication(endpoint);
    if (requiresAuth && !headers['Authorization']) {
      console.log(`Skipping authenticated endpoint ${endpoint} in guest mode`);
      return {
        success: false,
        error: 'Authentication required',
        message: 'Please login to access this feature'
      };
    }

    const url = `${this.baseUrl}${endpoint}`;
    const requestHeaders = {
      ...this.getDefaultHeaders(),
      ...headers
    };

    // Create a custom timeout implementation that works in all React Native versions
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    // Track this request
    this.activeRequests.push(controller);

    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      signal: controller.signal,
    };

    if (body && method !== 'GET') {
      requestOptions.body = JSON.stringify(body);
    }

    try {
      console.log(`API Request: ${method} ${url}`);
      console.log('Request headers:', requestHeaders);
      if (body) {
        console.log('Request body:', body);
      }

      const response = await fetch(url, requestOptions);
      clearTimeout(timeoutId); // Clear the timeout
      
      // Remove this controller from active requests
      const index = this.activeRequests.indexOf(controller);
      if (index > -1) {
        this.activeRequests.splice(index, 1);
      }

      console.log(`API Response: ${response.status} ${response.statusText}`);
      console.log('Response headers:', response.headers);

      // Get response text first (can only be read once)
      const responseText = await response.text();
      console.log('Raw response text:', responseText);

      // Check if response is ok (status 200-299)
      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`);

        // Try to get error details from response
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        let errorData = null;

        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            errorData = JSON.parse(responseText);
            errorMessage = errorData.message || errorData.error || errorMessage;
          } else {
            console.error('Non-JSON response:', responseText);
            errorMessage = `Server returned non-JSON response: ${responseText.substring(0, 200)}...`;
          }
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
          errorMessage = `Failed to parse error response: ${parseError}`;
        }

        return {
          success: false,
          message: errorMessage,
          error: errorMessage,
          data: errorData
        };
      }

      // Try to parse JSON response
      let responseData;
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          responseData = JSON.parse(responseText);
        } else {
          console.warn('Response is not JSON, attempting to parse as text:', responseText.substring(0, 200));

          // Try to parse as JSON anyway (in case content-type is wrong)
          try {
            responseData = JSON.parse(responseText);
          } catch (jsonError) {
            throw new Error(`Server returned non-JSON response: ${responseText.substring(0, 200)}...`);
          }
        }
      } catch (parseError) {
        console.error('JSON Parse error:', parseError);
        return {
          success: false,
          error: `JSON Parse error: ${parseError instanceof Error ? parseError.message : 'Unknown parse error'}`,
          message: 'Failed to parse server response'
        };
      }

      console.log('Response data:', responseData);

      return {
        success: response.ok,
        ...responseData
      };
    } catch (error) {
      clearTimeout(timeoutId); // Clear the timeout on error too
      console.error('API request failed:', error);
      
      // Remove this controller from active requests
      const index = this.activeRequests.indexOf(controller);
      if (index > -1) {
        this.activeRequests.splice(index, 1);
      }

      let errorMessage = 'Network error';
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Request timeout';
        } else if (error.message.includes('JSON Parse error')) {
          errorMessage = error.message;
        } else {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        error: errorMessage,
        message: errorMessage
      };
    }
  }

  // Authentication methods
  async login(email: string, password: string) {
    return this.request('/mobile/login', {
      method: 'POST',
      body: { email, password }
    });
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) {
    return this.request('/mobile/register', {
      method: 'POST',
      body: userData
    });
  }

  async logout(token: string) {
    return this.request('/mobile/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  // Social login methods
  async googleLogin(googleData: {
    email: string;
    name: string;
    id: string;
    access_token: string;
  }) {
    return this.request('/mobile/google-login', {
      method: 'POST',
      body: googleData
    });
  }

  async facebookLogin(facebookData: {
    email: string;
    name: string;
    id: string;
    access_token: string;
  }) {
    return this.request('/mobile/facebook-login', {
      method: 'POST',
      body: facebookData
    });
  }

  async getSocialConfig() {
    return this.request('/mobile/social-config', {
      method: 'GET'
    });
  }

  async getTestSocialConfig() {
    return this.request('/mobile/test-social-config', {
      method: 'GET'
    });
  }

  // FCM Token methods
  async storeFCMToken(token: string, platform: 'ios' | 'android', authToken?: string) {
    const headers: Record<string, string> = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    return this.request('/fcm-token', {
      method: 'POST',
      body: { fcm_token: token, platform },
      headers
    });
  }

  async removeFCMToken(authToken?: string) {
    const headers: Record<string, string> = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    return this.request('/fcm-token', {
      method: 'DELETE',
      headers
    });
  }

  // Notification methods
  async getNotifications(authToken: string) {
    return this.request(API_ENDPOINTS.NOTIFICATIONS, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  async markNotificationAsRead(notificationId: string, authToken: string) {
    return this.request(`/mobile/notifications/${notificationId}/mark-as-read`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  // Configuration methods
  async getConfig() {
    return this.request('/config', {
      method: 'GET'
    });
  }

  // Course methods
  async getCourses(authToken?: string) {
    const headers: Record<string, string> = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    return this.request('/courses', {
      method: 'GET',
      headers
    });
  }

  // Category methods - using consistent request method
  async getCategories() {
    return this.request('/mobile/categories', {
      method: 'GET',
      timeout: 8000 // 8 second timeout for production
    });
  }

  async getCategoryCourses(categoryId: string) {
    return this.request(`/mobile/categories/${categoryId}`, {
      method: 'GET'
    });
  }

  // Live courses methods
  async getLiveCourses() {
    return this.request('/mobile/live-courses', {
      method: 'GET'
    });
  }

  async getCourseDetail(courseId: string, authToken?: string) {
    const headers: Record<string, string> = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    return this.request(`/mobile/courses/${courseId}`, {
      method: 'GET',
      headers
    });
  }

  async enrollInCourse(courseId: string, authToken: string) {
    return this.request(`/mobile/courses/${courseId}/enroll`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  async getProfile(authToken: string) {
    return this.request(API_ENDPOINTS.PROFILE, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  async updateProfile(profileData: any, authToken: string) {
    return this.request('/profile', {
      method: 'PUT',
      body: profileData,
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  // Dashboard methods
  async getDashboardStats(authToken: string) {
    return this.request(API_ENDPOINTS.DASHBOARD_STATS, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  async getDashboardNoticeboards(authToken: string) {
    return this.request('/mobile/panel/noticeboard', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  // User settings methods
  async toggleOfflineStatus(offline: boolean, authToken: string) {
    return this.request('/mobile/panel/users/offlineToggle', {
      method: 'POST',
      body: { offline },
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  // Financial methods
  async getFinancialSummary(authToken: string) {
    return this.request('/mobile/panel/financial/summary', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  async getAccountBalance(authToken: string) {
    return this.request('/mobile/panel/financial/account', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  // Course methods
  async getPurchasedCourses(authToken: string) {
    return this.request(API_ENDPOINTS.PURCHASED_COURSES, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  async getMyWebinars(authToken: string) {
    return this.request('/mobile/panel/webinars', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  // Meeting methods
  async getMeetingRequests(authToken: string) {
    return this.request('/mobile/panel/meetings/requests', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  async getMeetingReservations(authToken: string) {
    return this.request('/mobile/panel/meetings/reservation', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  // Quiz methods
  async getQuizResults(authToken: string) {
    return this.request('/mobile/panel/quizzes/my-results', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  // Certificate methods
  async getCertificates(authToken: string) {
    return this.request('/mobile/panel/certificates', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  // Support methods
  async getSupportMessages(authToken: string) {
    return this.request(API_ENDPOINTS.SUPPORT_MESSAGES, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  // Comment methods
  async getMyComments(authToken: string) {
    return this.request(API_ENDPOINTS.COMMENTS, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  async getWebinarComments(authToken: string) {
    return this.request('/mobile/panel/webinars/comments', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  // Noticeboard methods
  async getNoticeboards(authToken: string) {
    return this.request('/mobile/panel/noticeboard', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  // Settings methods
  async getUserSettings(authToken: string) {
    return this.request('/mobile/panel/setting', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  async updateUserSettings(settingsData: any, authToken: string) {
    return this.request('/mobile/panel/setting', {
      method: 'POST',
      body: settingsData,
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  // Meeting methods
  // Transaction methods
  async getTransactions(authToken: string) {
    return this.request('/mobile/panel/financial/transactions', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  // Dashboard data methods
  async getPurchasedCoursesList(authToken: string) {
    return this.request('/mobile/panel/webinars/purchases', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  // Optimized methods for home screen with retry logic
  async getHomeQuickData(authToken: string, retryCount = 0): Promise<ApiResponse> {
    try {
      const response = await this.request('/mobile/home/quick-data', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        timeout: 10000 // 10 second timeout for production
      });

      // If successful, return response
      if (response.success) {
        return response;
      }

      // If failed and we haven't retried yet, try once more
      if (!response.success && retryCount < 1) {
        console.log('Quick data failed, retrying...');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        return this.getHomeQuickData(authToken, retryCount + 1);
      }

      return response;
    } catch (error) {
      // If error and we haven't retried yet, try once more
      if (retryCount < 1) {
        console.log('Quick data error, retrying...', error);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        return this.getHomeQuickData(authToken, retryCount + 1);
      }

      throw error;
    }
  }

  async getPurchasedCoursesPreview(authToken: string, retryCount = 0): Promise<ApiResponse> {
    try {
      const response = await this.request('/mobile/courses/purchased/preview', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        timeout: 8000 // 8 second timeout for production
      });

      // If successful, return response
      if (response.success) {
        return response;
      }

      // If failed and we haven't retried yet, try once more
      if (!response.success && retryCount < 1) {
        console.log('Purchased courses failed, retrying...');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        return this.getPurchasedCoursesPreview(authToken, retryCount + 1);
      }

      return response;
    } catch (error) {
      // If error and we haven't retried yet, try once more
      if (retryCount < 1) {
        console.log('Purchased courses error, retrying...', error);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        return this.getPurchasedCoursesPreview(authToken, retryCount + 1);
      }

      throw error;
    }
  }

  async getSupportMessagesList(authToken: string) {
    return this.request('/mobile/panel/support', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  // async getMeetingsList(authToken: string, isUser: boolean = true) {
  //   const endpoint = isUser ? '/panel/meetings/reservation' : '/panel/meetings/requests';
  //   return this.request(endpoint, {
  //     method: 'GET',
  //     headers: {
  //       'Authorization': `Bearer ${authToken}`
  //     }
  //   });
  // }

  async getCommentsList(authToken: string, isUser: boolean = true) {
    const endpoint = isUser ? '/mobile/panel/webinars/my-comments' : '/mobile/panel/webinars/comments';
    return this.request(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  // Course progress methods
  async getCourseProgress(courseId: string, authToken: string) {
    return this.request(`/mobile/progress/${courseId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  // Support ticket methods
  async createSupportTicket(ticketData: any, authToken: string) {
    return this.request('/mobile/panel/support', {
      method: 'POST',
      body: ticketData,
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  async getSupportTicketDetails(ticketId: string, authToken: string) {
    return this.request(`/mobile/panel/support/${ticketId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  // Meeting methods
  async getAvailableMeetingTimes(instructorId: number, date: string, authToken: string) {
    return this.request(`/mobile/meetings/available-times/${instructorId}?date=${date}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  async calculateMeetingCost(timeId: number, meetingType: string, studentCount: number, authToken: string) {
    return this.request('/mobile/meetings/calculate-cost', {
      method: 'POST',
      body: {
        time_id: timeId,
        meeting_type: meetingType,
        student_count: studentCount
      },
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  async reserveMeeting(authToken: string, meetingData: any) {
    return this.request('/mobile/meetings/reserve', {
      method: 'POST',
      body: meetingData,
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  async getMyReservations(authToken: string) {
    return this.request('/mobile/meetings/my-reservations', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  async getInstructorRequests(authToken: string) {
    return this.request('/mobile/meetings/instructor-requests', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  async confirmMeetingRequest(reservationId: number, authToken: string) {
    return this.request(`/mobile/meetings/${reservationId}/confirm`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  async cancelMeetingReservation(reservationId: number, authToken: string) {
    return this.request(`/mobile/meetings/${reservationId}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  // Test methods for development
  async testMeetingCreation(authToken: string) {
    return this.request('/mobile/meetings/test', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  async createTestMeeting(authToken: string) {
    return this.request('/mobile/meetings/create-test', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  // Comment methods
  async addComment(commentData: any, authToken: string) {
    return this.request('/mobile/panel/webinars/comments', {
      method: 'POST',
      body: commentData,
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  async updateComment(commentId: string, commentData: any, authToken: string) {
    return this.request(`/mobile/panel/webinars/comments/${commentId}`, {
      method: 'PUT',
      body: commentData,
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  async deleteComment(commentId: string, authToken: string) {
    return this.request(`/mobile/panel/webinars/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  // Content methods
  async getHomeContent() {
    return this.request('/home-content', {
      method: 'GET'
    });
  }

  async search(query: string) {
    return this.request('/search', {
      method: 'GET',
      body: { query }
    });
  }

  // Progress methods
  async getProgress(authToken: string) {
    return this.request('/progress', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  async updateProgress(progressData: any, authToken: string) {
    return this.request('/progress/update', {
      method: 'POST',
      body: progressData,
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  // Offline content methods
  async getOfflineContent() {
    return this.request('/offline-content', {
      method: 'GET'
    });
  }

  async syncOfflineContent(syncData: any) {
    return this.request('/offline-content/sync', {
      method: 'POST',
      body: syncData
    });
  }

  // Course Learning methods
  async getCourseLearningData(courseId: string, authToken: string) {
    return this.request(`/mobile/courses/${courseId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  async updateCourseProgress(courseId: string, itemId: number, status: 'started' | 'completed', authToken: string, itemType: string = 'file') {
    return this.request(`/mobile/progress/update`, {
      method: 'POST',
      body: {
        webinar_id: courseId,
        item_id: itemId,
        status: status,
        item_type: itemType
      },
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  async getCourseVideoUrl(videoId: string, authToken: string) {
    return this.request(`/mobile/files/${videoId}/download`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  async getFileDownloadUrl(fileId: string, authToken: string) {
    return this.request(`/mobile/files/${fileId}/download`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  async getFileStreamUrl(fileId: string, authToken: string) {
    try {
      // Use the mobile public stream endpoint with token as query parameter
      const response = await this.request(`/mobile/files/${fileId}/public-stream?token=${authToken}`, {
        method: 'GET'
        // No Authorization header needed since token is in query parameter
      });

      if (response.success) {
        return response;
      }

      console.log('Streaming failed, response:', response);

      // Fallback to direct download URL if streaming fails
      console.log('Trying direct download...');
      return this.request(`/mobile/files/${fileId}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
    } catch (error) {
      console.error('File streaming error:', error);

      // If the error is due to HTML response, try direct download
      if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string' && error.message.includes('HTML')) {
        console.log('HTML response detected, trying direct download...');
        return this.request(`/mobile/files/${fileId}/download`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
      }

      // Fallback to direct download URL
      return this.request(`/mobile/files/${fileId}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
    }
  }

  // Get direct video URL from course data
  async getDirectVideoUrl(fileId: string, authToken: string) {
    return this.request(`/mobile/files/${fileId}/download`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  async getMeetingsList(token: string, isStudent: boolean = true): Promise<ApiResponse<MeetingListItem[]>> {
    const endpoint = isStudent ? '/mobile/panel/webinars/meetings' : '/mobile/panel/meetings/requests';

    return this.request<MeetingListItem[]>(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Get list of instructors
  async getInstructors(token: string): Promise<ApiResponse<Instructor[]>> {
    return this.request<Instructor[]>('/mobile/instructors', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Get instructor details with meetings
  async getInstructorMeetings(token: string, instructorId: number): Promise<ApiResponse<Meeting[]>> {
    return this.request<Meeting[]>(`/mobile/instructors/${instructorId}/meetings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Get available slots for a specific meeting time
  async getMeetingAvailableSlots(
    token: string,
    meetingTimeId: number,
    month: string
  ): Promise<ApiResponse<AvailableSlot[]>> {
    return this.request<AvailableSlot[]>(`/meetings/available-slots/${meetingTimeId}?month=${month}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }



  // Get meeting details
  async getMeetingDetails(token: string, meetingId: number): Promise<ApiResponse<Meeting>> {
    return this.request<Meeting>(`/meetings/${meetingId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Get session details
  async getSessionDetails(token: string, sessionId: number): Promise<ApiResponse<any>> {
    return this.request(`/mobile/sessions/${sessionId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Mark session as completed
  async markSessionAsCompleted(token: string, sessionId: number): Promise<ApiResponse> {
    return this.request(`/mobile/sessions/${sessionId}/complete`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Debug method for testing categories API (keep for debugging)
  async debugGetCategories() {
    console.log('=== DEBUG: Testing Categories API ===');
    console.log('Base URL:', this.baseUrl);
    console.log('API Key:', this.apiKey);
    console.log('Full URL:', `${this.baseUrl}/mobile/categories`);
    console.log('Default Headers:', this.getDefaultHeaders());

    try {
      const response = await fetch(`${this.baseUrl}/mobile/categories`, {
        method: 'GET',
        headers: this.getDefaultHeaders(),
      });

      console.log('Raw Response Status:', response.status);
      console.log('Raw Response Headers:', response.headers);

      const responseText = await response.text();
      console.log('Raw Response Text:', responseText);

      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log('Parsed Response Data:', responseData);
      } catch (parseError) {
        console.log('JSON Parse Error:', parseError);
        console.log('Response is not valid JSON');
      }

      return {
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        data: responseData,
        rawText: responseText
      };
    } catch (error) {
      console.log('Fetch Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        rawError: error
      };
    }
  }

}

export const apiService = new ApiService();
export default apiService;
