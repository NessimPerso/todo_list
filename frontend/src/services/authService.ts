import api, { tokenService } from './api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export const authService = {
  // Connexion
  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      const response = await api.post<any>('/auth/login', data); // Changé de AuthResponse à any
      
      console.log('API Response:', response.data); // Debug log
      
      // Stocker le token dans le localStorage
      tokenService.setToken(response.data.access_token);
      
      // Si l'API retourne déjà user, on l'utilise
      if (response.data.user) {
        return response.data;
      }
      
      // Sinon, on décode le token pour récupérer les infos utilisateur
      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error('Impossible de récupérer les informations utilisateur');
      }
      
      return {
        access_token: response.data.access_token,
        user: user
      };
    } catch (error:any) {
      console.error('Erreur lors de la connexion:', error);
      // Gérer les erreurs spécifiques
       if (error.response?.status === 401) {
        throw new Error('Email ou mot de passe incorrect');
      } else if (error.response?.status === 400) {
        throw new Error('Données de connexion invalides');
      } else if (error.response?.status >= 500) {
        throw new Error('Erreur du serveur, veuillez réessayer plus tard');
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        throw new Error('Impossible de se connecter au serveur');
      } else {
        throw new Error('Une erreur inattendue s\'est produite');
      }
    }
  },

  // Inscription
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await api.post<any>('/auth/register', data);
      
      // Stocker le token dans le localStorage
      tokenService.setToken(response.data.access_token);
      
      // Si l'API retourne déjà user, on l'utilise
      if (response.data.user) {
        return response.data;
      }
      
      // Sinon, on décode le token pour récupérer les infos utilisateur
      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error('Impossible de récupérer les informations utilisateur');
      }
      
      return {
        access_token: response.data.access_token,
        user: user
      };
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  },

  // Déconnexion
  logout: (): void => {
    tokenService.removeToken();
    window.location.href = '/auth'; // Changé de '/login' à '/auth' pour correspondre à votre route
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: (): boolean => {
    return tokenService.isAuthenticated();
  },

  // Obtenir les informations de l'utilisateur depuis le token
  getCurrentUser: () => {
    const token = tokenService.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Token payload:', payload); // Debug log ajouté
      return {
        id: payload.sub,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
      };
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error); // Debug log amélioré
      return null;
    }
  }
};