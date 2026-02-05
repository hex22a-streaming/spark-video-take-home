import { describe, expect, it, type Mock, vi } from 'vitest';
import { POST } from './+server';
import {
  expectedExistingVideo,
  expectedExistingVideoUrl
} from '$lib/model/__tests__/helpers/fixtures';
import { constants } from 'http2';
import type { Cookies, RequestEvent } from '@sveltejs/kit';
import type { RouteParams } from '$app/types';

import type { VideoRequest } from '$lib/definitions';
import {
  createVideo as mockCreateVideo,
  getVideoByUrl as mockGetVideoByUrl,
  VIDEO_EXISTS_ERROR_MESSAGE
} from '$lib/model/data/video.server';
import { getPlatform as mockGetPlatform } from '$lib/parser';
import {
  MALFORMED_URL_ERROR_MESSAGE,
  UNSUPPORTED_PLATFORM_ERROR_MESSAGE,
  Z_INVALID_INPUT_ERROR_MESSAGE,
  Z_URL_FORMAT_ERROR_MESSAGE
} from '$lib/constants';

vi.mock('$lib/model/data/video.server');
vi.mock('$lib/parser');

describe('/api/preview', () => {
  const expectedBase = 'http://localhost';
  const expectedRoute = '/api/preview';
  const expectedUrl: URL = new URL(expectedRoute, expectedBase);
  const expectedCache: RequestCache = 'default';
  const expectedCredentials: RequestCredentials = 'omit';
  const expectedDeclaration: RequestDestination = 'document';
  const expectedMode: RequestMode = 'same-origin';
  const expectedRedirect: RequestRedirect = 'follow';
  const expectedPolicy: ReferrerPolicy = 'no-referrer';
  const expectedHeaders: Headers = new Headers();
  const expectedAbortController: AbortController = new AbortController();
  const expectedSignal: AbortSignal = expectedAbortController.signal;

  const mockCookies: Cookies = {
    delete: vi.fn(),
    get: vi.fn(),
    getAll: vi.fn(),
    serialize: vi.fn(),
    set: vi.fn(),
  };

  describe('POST', () => {
    const expectedPlatform = 'youtube';

    it('returns 400 with error message if request is malformed', async () => {
      // Arrange
      const expectedRequestJson = { foo: 'bar' };
      const expectedResponse = {
        error: Z_INVALID_INPUT_ERROR_MESSAGE
      };
      const mockJson = vi.fn().mockResolvedValue(expectedRequestJson);

      const expectedRequest: Request = {
        arrayBuffer: vi.fn(),
        blob: vi.fn(),
        body: {
          locked: false,
          cancel: vi.fn(),
          getReader: vi.fn(),
          pipeThrough: vi.fn(),
          pipeTo: vi.fn(),
          tee: vi.fn()
        },
        bodyUsed: false,
        bytes: vi.fn(),
        cache: expectedCache,
        clone: vi.fn(),
        credentials: expectedCredentials,
        destination: expectedDeclaration,
        formData: vi.fn(),
        headers: expectedHeaders,
        integrity: '',
        json: mockJson,
        keepalive: false,
        method: '',
        mode: expectedMode,
        redirect: expectedRedirect,
        referrer: '',
        referrerPolicy: expectedPolicy,
        signal: expectedSignal,
        text: vi.fn(),
        url: expectedUrl.toString()
      };

      const mockRequestEvent: RequestEvent<RouteParams<'/api/preview'>, '/api/preview'> = {
        cookies: mockCookies,
        fetch: vi.fn(),
        getClientAddress: vi.fn(),
        isDataRequest: false,
        isRemoteRequest: false,
        isSubRequest: false,
        locals: {},
        params: {},
        platform: undefined,
        route: { id: expectedRoute },
        setHeaders: vi.fn(),
        tracing: { current: undefined, enabled: false, root: undefined },
        url: expectedUrl,
        request: expectedRequest
      };

      // Act
      const actualResponse = await POST(mockRequestEvent);

      // Assert
      expect(actualResponse.status).toEqual(constants.HTTP_STATUS_BAD_REQUEST);
      expect(await actualResponse.json()).toEqual(expectedResponse);
    });

    it('returns 422 with error message if url is empty', async () => {
      // Arrange
      const expectedRequestJson = { url: '' };
      const expectedResponse = {
        error: Z_URL_FORMAT_ERROR_MESSAGE
      };
      const mockJson = vi.fn().mockResolvedValue(expectedRequestJson);

      const expectedRequest: Request = {
        arrayBuffer: vi.fn(),
        blob: vi.fn(),
        body: {
          locked: false,
          cancel: vi.fn(),
          getReader: vi.fn(),
          pipeThrough: vi.fn(),
          pipeTo: vi.fn(),
          tee: vi.fn()
        },
        bodyUsed: false,
        bytes: vi.fn(),
        cache: expectedCache,
        clone: vi.fn(),
        credentials: expectedCredentials,
        destination: expectedDeclaration,
        formData: vi.fn(),
        headers: expectedHeaders,
        integrity: '',
        json: mockJson,
        keepalive: false,
        method: '',
        mode: expectedMode,
        redirect: expectedRedirect,
        referrer: '',
        referrerPolicy: expectedPolicy,
        signal: expectedSignal,
        text: vi.fn(),
        url: expectedUrl.toString()
      };

      const mockRequestEvent: RequestEvent<RouteParams<'/api/preview'>, '/api/preview'> = {
        cookies: mockCookies,
        fetch: vi.fn(),
        getClientAddress: vi.fn(),
        isDataRequest: false,
        isRemoteRequest: false,
        isSubRequest: false,
        locals: {},
        params: {},
        platform: undefined,
        route: { id: expectedRoute },
        setHeaders: vi.fn(),
        tracing: { current: undefined, enabled: false, root: undefined },
        url: expectedUrl,
        request: expectedRequest
      };

      // Act
      const actualResponse = await POST(mockRequestEvent);

      // Assert
      expect(actualResponse.status).toEqual(constants.HTTP_STATUS_UNPROCESSABLE_ENTITY);
      expect(await actualResponse.json()).toEqual(expectedResponse);
    });

    it('returns 422 with error message if platform is not supported', async () => {
      // Arrange
      (mockGetPlatform as Mock).mockImplementation(() => { throw new Error(UNSUPPORTED_PLATFORM_ERROR_MESSAGE); });
      const expectedUnsupportedPlatformUrl = 'https://www.yahoo.com/';
      const expectedRequestJson: VideoRequest = { url: expectedUnsupportedPlatformUrl };
      const expectedResponse = {
        error: UNSUPPORTED_PLATFORM_ERROR_MESSAGE
      };
      const mockJson = vi.fn().mockResolvedValue(expectedRequestJson);

      const expectedRequest: Request = {
        arrayBuffer: vi.fn(),
        blob: vi.fn(),
        body: {
          locked: false,
          cancel: vi.fn(),
          getReader: vi.fn(),
          pipeThrough: vi.fn(),
          pipeTo: vi.fn(),
          tee: vi.fn()
        },
        bodyUsed: false,
        bytes: vi.fn(),
        cache: expectedCache,
        clone: vi.fn(),
        credentials: expectedCredentials,
        destination: expectedDeclaration,
        formData: vi.fn(),
        headers: expectedHeaders,
        integrity: '',
        json: mockJson,
        keepalive: false,
        method: '',
        mode: expectedMode,
        redirect: expectedRedirect,
        referrer: '',
        referrerPolicy: expectedPolicy,
        signal: expectedSignal,
        text: vi.fn(),
        url: expectedUrl.toString()
      };

      const mockRequestEvent: RequestEvent<RouteParams<'/api/preview'>, '/api/preview'> = {
        cookies: mockCookies,
        fetch: vi.fn(),
        getClientAddress: vi.fn(),
        isDataRequest: false,
        isRemoteRequest: false,
        isSubRequest: false,
        locals: {},
        params: {},
        platform: undefined,
        route: { id: expectedRoute },
        setHeaders: vi.fn(),
        tracing: { current: undefined, enabled: false, root: undefined },
        url: expectedUrl,
        request: expectedRequest
      };

      // Act
      const actualResponse = await POST(mockRequestEvent);

      // Assert
      expect(actualResponse.status).toEqual(constants.HTTP_STATUS_UNPROCESSABLE_ENTITY);
      expect(await actualResponse.json()).toEqual(expectedResponse);
    });

    it('returns 422 with error message if provided wrong url', async () => {
      // Arrange
      (mockGetPlatform as Mock).mockImplementation(() => { throw new Error(MALFORMED_URL_ERROR_MESSAGE); });
      const expectedUnsupportedPlatformUrl = 'not a url';
      const expectedRequestJson: VideoRequest = { url: expectedUnsupportedPlatformUrl };
      const expectedResponse = {
        error: Z_URL_FORMAT_ERROR_MESSAGE
      };
      const mockJson = vi.fn().mockResolvedValue(expectedRequestJson);

      const expectedRequest: Request = {
        arrayBuffer: vi.fn(),
        blob: vi.fn(),
        body: {
          locked: false,
          cancel: vi.fn(),
          getReader: vi.fn(),
          pipeThrough: vi.fn(),
          pipeTo: vi.fn(),
          tee: vi.fn()
        },
        bodyUsed: false,
        bytes: vi.fn(),
        cache: expectedCache,
        clone: vi.fn(),
        credentials: expectedCredentials,
        destination: expectedDeclaration,
        formData: vi.fn(),
        headers: expectedHeaders,
        integrity: '',
        json: mockJson,
        keepalive: false,
        method: '',
        mode: expectedMode,
        redirect: expectedRedirect,
        referrer: '',
        referrerPolicy: expectedPolicy,
        signal: expectedSignal,
        text: vi.fn(),
        url: expectedUrl.toString()
      };

      const mockRequestEvent: RequestEvent<RouteParams<'/api/preview'>, '/api/preview'> = {
        cookies: mockCookies,
        fetch: vi.fn(),
        getClientAddress: vi.fn(),
        isDataRequest: false,
        isRemoteRequest: false,
        isSubRequest: false,
        locals: {},
        params: {},
        platform: undefined,
        route: { id: expectedRoute },
        setHeaders: vi.fn(),
        tracing: { current: undefined, enabled: false, root: undefined },
        url: expectedUrl,
        request: expectedRequest
      };

      // Act
      const actualResponse = await POST(mockRequestEvent);

      // Assert
      expect(actualResponse.status).toEqual(constants.HTTP_STATUS_UNPROCESSABLE_ENTITY);
      expect(await actualResponse.json()).toEqual(expectedResponse);
    });

    it('returns json containing url, platform and existing_asset if asset already exists', async () => {
      // Arrange
      const expectedExistingAsset = { ...expectedExistingVideo, created_at: new Date() };
      (mockCreateVideo as Mock).mockRejectedValue(new Error(VIDEO_EXISTS_ERROR_MESSAGE));
      (mockGetVideoByUrl as Mock).mockResolvedValue(expectedExistingAsset);
      (mockGetPlatform as Mock).mockReturnValue(expectedPlatform);
      const expectedRequestJson: VideoRequest = { url: expectedExistingVideoUrl };
      const expectedResponse = {
        url: expectedExistingVideoUrl,
        platform: expectedPlatform,
        existing_asset: { ...expectedExistingAsset, created_at: expectedExistingAsset.created_at.toISOString() }
      };
      const mockJson = vi.fn().mockResolvedValue(expectedRequestJson);

      const expectedRequest: Request = {
        arrayBuffer: vi.fn(),
        blob: vi.fn(),
        body: {
          locked: false,
          cancel: vi.fn(),
          getReader: vi.fn(),
          pipeThrough: vi.fn(),
          pipeTo: vi.fn(),
          tee: vi.fn()
        },
        bodyUsed: false,
        bytes: vi.fn(),
        cache: expectedCache,
        clone: vi.fn(),
        credentials: expectedCredentials,
        destination: expectedDeclaration,
        formData: vi.fn(),
        headers: expectedHeaders,
        integrity: '',
        json: mockJson,
        keepalive: false,
        method: '',
        mode: expectedMode,
        redirect: expectedRedirect,
        referrer: '',
        referrerPolicy: expectedPolicy,
        signal: expectedSignal,
        text: vi.fn(),
        url: expectedUrl.toString()
      };

      const mockRequestEvent: RequestEvent<RouteParams<'/api/preview'>, '/api/preview'> = {
        cookies: mockCookies,
        fetch: vi.fn(),
        getClientAddress: vi.fn(),
        isDataRequest: false,
        isRemoteRequest: false,
        isSubRequest: false,
        locals: {},
        params: {},
        platform: undefined,
        route: { id: expectedRoute },
        setHeaders: vi.fn(),
        tracing: { current: undefined, enabled: false, root: undefined },
        url: expectedUrl,
        request: expectedRequest
      };

      // Act
      const actualResponse = await POST(mockRequestEvent);

      // Assert
      expect(actualResponse.status).toEqual(constants.HTTP_STATUS_OK);
      expect(await actualResponse.json()).toEqual(expectedResponse);
    });

    it('returns json containing url, platform and existing_asset: null if asset does not exist', async () => {
      // Arrange
      (mockCreateVideo as Mock).mockResolvedValue(expectedExistingVideo);
      (mockGetVideoByUrl as Mock).mockResolvedValue(undefined);
      (mockGetPlatform as Mock).mockReturnValue(expectedPlatform);
      const expectedVideoUrl = 'https://www.youtube.com/watch?v=h_1qim3_A1w';
      const expectedRequestJson: VideoRequest = { url: expectedVideoUrl };
      const expectedResponse = {
        url: expectedVideoUrl,
        platform: expectedPlatform,
        existing_asset: null
      };

      const mockJson = vi.fn().mockResolvedValue(expectedRequestJson);

      const expectedRequest: Request = {
        arrayBuffer: vi.fn(),
        blob: vi.fn(),
        body: {
          locked: false,
          cancel: vi.fn(),
          getReader: vi.fn(),
          pipeThrough: vi.fn(),
          pipeTo: vi.fn(),
          tee: vi.fn()
        },
        bodyUsed: false,
        bytes: vi.fn(),
        cache: expectedCache,
        clone: vi.fn(),
        credentials: expectedCredentials,
        destination: expectedDeclaration,
        formData: vi.fn(),
        headers: expectedHeaders,
        integrity: '',
        json: mockJson,
        keepalive: false,
        method: '',
        mode: expectedMode,
        redirect: expectedRedirect,
        referrer: '',
        referrerPolicy: expectedPolicy,
        signal: expectedSignal,
        text: vi.fn(),
        url: expectedUrl.toString()
      };

      const mockRequestEvent: RequestEvent<RouteParams<'/api/preview'>, '/api/preview'> = {
        cookies: mockCookies,
        fetch: vi.fn(),
        getClientAddress: vi.fn(),
        isDataRequest: false,
        isRemoteRequest: false,
        isSubRequest: false,
        locals: {},
        params: {},
        platform: undefined,
        route: { id: expectedRoute },
        setHeaders: vi.fn(),
        tracing: { current: undefined, enabled: false, root: undefined },
        url: expectedUrl,
        request: expectedRequest
      };

      // Act
      const actualResponse = await POST(mockRequestEvent);

      // Assert
      expect(actualResponse.status).toEqual(constants.HTTP_STATUS_CREATED);
      expect(await actualResponse.json()).toEqual(expectedResponse);
    });
  });
});
