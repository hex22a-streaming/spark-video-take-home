import { describe, expect, it, type Mock, vi } from 'vitest';
import type { AssetRequest, AssetType } from '$lib/definitions';
import type { RouteParams } from '$app/types';
import type { Cookies, RequestEvent } from '@sveltejs/kit';
import { POST } from './+server';

import {
  createVideo as mockCreateVideo,
  getVideoByUrl as mockGetVideoByUrl
} from '$lib/model/data/video.server';
import { createAsset as mockCreateAsset } from '$lib/model/data/asset.server';
import { getPlatform as mockGetPlatform } from '$lib/parser';
import {
  expectedExistingAsset,
  expectedExistingVideo
} from '$lib/model/__tests__/helpers/fixtures';
import {
  EMPTY_TAGS_ERROR_MESSAGE,
  UNEXPECTED_END_OF_JSON_ERROR_MESSAGE,
  UNSUPPORTED_PLATFORM_ERROR_MESSAGE,
  Z_INVALID_INPUT_ERROR_MESSAGE
} from '$lib/constants';
import { constants } from 'http2';


vi.mock('$lib/model/data/video.server');
vi.mock('$lib/model/data/asset.server');
vi.mock('$lib/parser');

describe('/api/assets', () => {
  const expectedBase = 'http://localhost';
  const expectedRoute = '/api/assets';
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
    set: vi.fn()
  };

  describe('POST', () => {
    const expectedTags: AssetType[] = ['Motion', 'Color'];
    const expectedPlatform = 'youtube';

    it('returns 400 if request is empty', async () => {
      // Arrange
      const expectedResponse = {
        error: UNEXPECTED_END_OF_JSON_ERROR_MESSAGE
      };

      const mockJson = vi.fn().mockImplementation(() => { throw new Error(UNEXPECTED_END_OF_JSON_ERROR_MESSAGE); });

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

      const mockRequestEvent: RequestEvent<RouteParams<'/api/assets'>, '/api/assets'> = {
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

    it('returns 400 if request is malformed', async () => {
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

      const mockRequestEvent: RequestEvent<RouteParams<'/api/assets'>, '/api/assets'> = {
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

    it('returns 422 if platform is not supported', async () => {
      // Arrange
      (mockGetPlatform as Mock).mockImplementation(() => {
        throw new Error(UNSUPPORTED_PLATFORM_ERROR_MESSAGE);
      });
      const expectedVideoUrl = 'https://www.yahoo.com/';
      const expectedRequestJson = { url: expectedVideoUrl, tags: expectedTags };
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

      const mockRequestEvent: RequestEvent<RouteParams<'/api/assets'>, '/api/assets'> = {
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

    it('returns 422 if tags are empty list', async () => {
      // Arrange
      (mockGetPlatform as Mock).mockReturnValue(expectedPlatform);
      (mockGetVideoByUrl as Mock).mockResolvedValue(expectedExistingVideo);
      (mockCreateAsset as Mock).mockResolvedValue(undefined);
      (mockGetPlatform as Mock).mockReturnValue(expectedPlatform);
      const expectedVideoUrl = 'https://www.youtube.com/watch?v=h_1qim3_A1w';
      const expectedRequestJson = { url: expectedVideoUrl, tags: [] };
      const expectedResponse = {
        error: EMPTY_TAGS_ERROR_MESSAGE
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

      const mockRequestEvent: RequestEvent<RouteParams<'/api/assets'>, '/api/assets'> = {
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

    it('returns json containing asset and created: true if asset was created', async () => {
      // Arrange
      const expectedCreatedAsset = { ...expectedExistingAsset, created_at: new Date() };
      (mockGetVideoByUrl as Mock).mockResolvedValue(undefined);
      (mockCreateVideo as Mock).mockResolvedValue(expectedExistingVideo);
      (mockCreateAsset as Mock).mockResolvedValue(expectedCreatedAsset);
      (mockGetPlatform as Mock).mockReturnValue(expectedPlatform);
      const expectedVideoUrl = 'https://www.youtube.com/watch?v=h_1qim3_A1w';
      const expectedRequestJson: AssetRequest = { tags: expectedTags, url: expectedVideoUrl };
      const expectedResponse = {
        asset: { ...expectedCreatedAsset, created_at: expectedCreatedAsset.created_at.toISOString() },
        created: true
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

      const mockRequestEvent: RequestEvent<RouteParams<'/api/assets'>, '/api/assets'> = {
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

    it('returns json containing asset and created: false if video already exists (though asset is still created)', async () => {
      // Arrange
      const expectedCreatedAsset = { ...expectedExistingAsset, created_at: new Date() };
      (mockGetVideoByUrl as Mock).mockResolvedValue(expectedExistingVideo);
      (mockCreateAsset as Mock).mockResolvedValue(expectedCreatedAsset);
      (mockGetPlatform as Mock).mockReturnValue(expectedPlatform);
      const expectedVideoUrl = 'https://www.youtube.com/watch?v=h_1qim3_A1w';
      const expectedRequestJson: AssetRequest = { tags: expectedTags, url: expectedVideoUrl };
      const expectedResponse = {
        asset: { ...expectedCreatedAsset, created_at: expectedCreatedAsset.created_at.toISOString() },
        created: false
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

      const mockRequestEvent: RequestEvent<RouteParams<'/api/assets'>, '/api/assets'> = {
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
